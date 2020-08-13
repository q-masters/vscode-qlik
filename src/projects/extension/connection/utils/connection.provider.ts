import * as vscode from "vscode";
import { singleton, container } from "tsyringe";
import { connect as tlsConnect} from "tls";
import { BehaviorSubject, Observable, from, of, timer } from "rxjs";
import { tap, switchMap, map, catchError, throttle } from "rxjs/operators";
import * as request from "request";

import { ConnectionSetting } from "../api";
import { ConnectionHelper } from "./connection.helper";
import { AuthorizationService } from "../../authorization/utils/authorization.service";
import { AuthorizationState } from "../../authorization/strategies/authorization.strategy";
import { ConnectionState, ConnectionModel } from "../model/connection";
import { AuthorizationHelper } from "projects/extension/authorization/authorization.helper";
import { ConnectionStorage } from "@data/tokens";
import { Storage } from "@core/storage";
import { EnigmaSession } from "./enigma.provider";

@singleton()
export class ConnectionProvider {

    private connectionIsRunning = false;

    private items: Connection[] = [];

    private connections: Set<Connection> = new Set();

    public async connect(connection: Connection) {
        this.items.push(connection);

        if (!this.connectionIsRunning) {
            await this.run();
        }
    }

    private async run(): Promise<void> {
        let connection = this.items.shift();
        this.connectionIsRunning = true;

        while (connection) {
            const isConnected = await connection.connect();
            if (isConnected) {
                this.add(connection);
            }
            connection = this.items.shift();
        }
        this.connectionIsRunning = false;
    }

    private add(connection: Connection) {
        /** add ping */
        this.connections.add(connection);
    }
}

/**
 * represents the connection to a server, which is a workspace folder in vscode
 * so this one should open new enigma sessions
 */
export class Connection {

    private connectionState: ConnectionState = ConnectionState.CLOSED;

    private state$: BehaviorSubject<ConnectionState>;

    private connectionModel: ConnectionModel;

    private storage: Storage;

    private engimaProvider: EnigmaSession;

    public constructor(
        private config: ConnectionSetting,
    ) {
        this.state$      = new BehaviorSubject(this.connectionState);
        this.storage     = container.resolve(ConnectionStorage);

        this.connectionModel = new ConnectionModel(config);
    }

    /**
     * runs a connection request
     */
    public connect(): Promise<boolean> {
        this.state$.next(ConnectionState.CONNECTING);

        const data = this.storage.read(JSON.stringify(this.config));
        this.connectionModel.cookies = data?.cookies ?? [];

        return this.serverExists().pipe(
            switchMap(() => this.checkCertificate()),
            switchMap(() => this.authorize()),
            tap(() => this.onConnected()),
            catchError((error) => {
                const message = `Could not connect to server message: ${error.message}`;
                vscode.window.showErrorMessage(message);
                this.state$.next(ConnectionState.ERROR);
                return of(false);
            })
        ).toPromise();
    }

    /**
     * disconnect
     */
    public async disconnect(): Promise<boolean> {
        return true;
    }

    /**
     * connection state changed
     */
    public stateChange(): Observable<ConnectionState> {
        return this.state$.asObservable();
    }

    public ping() {
        this.connectionModel.socket.ping(null, false, () => (error: Error) => console.log(error));
    }

    /**
     * send head request to server just to check we can reach this one
     */
    private serverExists(): Observable<void> {
        const url = ConnectionHelper.buildUrl(this.config);
        const req = new Promise<request.Request>((resolve) => {
            request.head({
                url,
                port: this.config.port,
                rejectUnauthorized: false
            }, resolve);
        });

        return from(req).pipe(map((response) => {
            if (response instanceof Error) {
                throw new Error(`not found: ${url}`);
            }
        }));
    }

    /**
     * check for secure connection and certificate
     * if this is a secure connection and certificate is not secure
     * the user have to accept the untrusted connection otherwise it will not connect
     */
    private checkCertificate(): Observable<boolean> {

        let secure$ = of(true);

        if (this.config.secure) {
            secure$ = secure$.pipe(
                switchMap(async () => await this.isTrusted() || await this.acceptUntrusted()),
                tap((secure) => {
                    if (!secure) {
                        throw new Error("not a trusted connection");
                    }
                })
            );
        }

        return secure$;
    }

    /**
     * checks certificate for https connections, if certificate is secure
     */
    private isTrusted(): Promise<boolean> {
        return new Promise((resolve) => {
            const socket = tlsConnect({
                port: this.config.port ?? 443,
                host: this.config.host,
                rejectUnauthorized: false
            }, () => {
                socket.authorized ? resolve(true) : resolve(false);
            });
        });
    }

    /**
     * certificate was not secure, show dialog the user can accept it anyways
     * or decline
     *
     * to much vscode inside
     */
    private acceptUntrusted(): Promise<boolean> {
        return new Promise((resolve) => {
            const qp = vscode.window.createQuickPick();
            qp.title = 'Current connection is not secure, continue ?';
            qp.items = [{label: 'yes'}, {label: 'no'}];
            qp.ignoreFocusOut = true;
            qp.canSelectMany = false;
            qp.onDidChangeSelection((selected) => {
                selected[0].label === 'yes' ? resolve(true) : resolve(false);

                if (selected[0].label === 'yes') {
                    this.connectionModel.isUntrusted = true;
                    resolve(true);
                } else {
                    resolve(false);
                }

                qp.dispose();
            });
            qp.show();
        });
    }
    /**
     * own service certificate check end
     */

    /**
     * check current authorization state, if we have to login
     * run authorization by strategy
     */
    private async authorize(): Promise<boolean> {

        const authState = await this.checkAuthState();
        if (authState.authorized) {
            return true;
        }

        const authService = container.resolve(AuthorizationService);
        const strategyConstructor = await AuthorizationHelper.resolveStrategy(this.config.authorization.strategy);

        if (strategyConstructor && authState.loginUri) {
            const strategy = new strategyConstructor({
                allowUntrusted: this.connectionModel.isUntrusted,
                uri: authState.loginUri as string,
                domain: this.config.authorization.data.domain,
                password: this.config.authorization.data.password,
            });

            const authResult = await authService.authorize(strategy);
            if (authResult.success) {
                this.connectionModel.cookies = authResult.cookies;
                return true;
            }
        }

        throw new Error('Authorization failed');
    }

    /**
     * resolves current authorization state
     *
     * checks we have an active session via session cookie so we dont need to authorize again
     * and if not we got some authorization informations
     */
    protected checkAuthState(): Promise<AuthorizationState> {
        return new Promise((resolve, reject) => {
            const session = ConnectionHelper.createEnigmaSession(this.connectionModel);
            session.on("traffic:received", (response) => {
                console.dir(response);
                (session as any).removeAllListeners();
                session.close();

                switch (response.method) {
                    case 'OnAuthenticationInformation':
                        this.connectionModel.isAuthorizationRequired = true;
                        resolve({ authorized: !response.params.mustAuthenticate, loginUri: response.params.loginUri });
                        break;

                    case 'OnConnected':
                        resolve({ authorized: true });
                        break;

                    default:
                        reject('something bad happens');
                }
            });
            session.open();
        });
    }

    /**
     * we got connected to server
     */
    private async onConnected() {

        /** create enigma provider */
        this.engimaProvider = new EnigmaSession(this.connectionModel);

        /** write cookies to storage */
        this.storage.write(JSON.stringify(this.config), {cookies: this.connectionModel.cookies});

        if (this.connectionModel.isAuthorizationRequired) {
            const global: EngineAPI.IGlobal = await this.engimaProvider.open() as EngineAPI.IGlobal;

            /** hearbeat */
            timer(5000, 5000).pipe(
                throttle(() => global.engineVersion()),
            ).subscribe({
                next: () => console.log("still connected"),
                error: () => this.onConnectionClose()
            });
        }
    }

    /**
     * connection to server has been closed
     */
    private onConnectionClose() {
        console.log("kaputt");
        this.storage.delete(JSON.stringify(this.config));
        this.connectionModel.state = ConnectionState.CLOSED;

        vscode.window.showErrorMessage(`Connection to server has been gone. ${this.connectionModel.setting.host}`);
        this.stateChanged();
    }

    /**
     * state of connection has been changed, time to notify the observers
     */
    private stateChanged() {
        this.state$.next(this.connectionModel.state);
    }
}
