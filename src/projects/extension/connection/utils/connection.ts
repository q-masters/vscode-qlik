import * as vscode from "vscode";
import { Subject, of, Observable, from, timer } from "rxjs";
import { container } from "tsyringe";
import { switchMap, tap, catchError, take, map, throttle, takeUntil } from "rxjs/operators";
import request from "request";
import { connect as tlsConnect} from "tls";

import { Storage } from "@core/storage";
import { ConnectionStorage } from "@data/tokens";
import { AuthorizationService } from "@auth/utils/authorization.service";
import { AuthorizationHelper } from "@auth/authorization.helper";
import { AuthorizationState } from "@auth/strategies/authorization.strategy";

import { ConnectionState, ConnectionModel } from "../model/connection";
import { ConnectionHelper } from "./connection.helper";
import { EnigmaSession } from "./enigma.provider";
import { WorkspaceSetting } from "@vsqlik/settings/api";
import { FileSystemStorage } from "@vsqlik/fs/utils/file-system.storage";

/**
 * represents the connection to a server, which is a workspace folder in vscode
 * so this one should open new enigma sessions
 */
export class Connection {

    private connectionModel: ConnectionModel;

    /**
     * handler for all enigma sessions
     */
    private engimaProvider: EnigmaSession;

    /**
     * storage to save data
     */
    private serverStorage: Storage;

    /**
     * one stream to unsubscribe everything
     */
    private destroy$: Subject<boolean> = new Subject();

    /**
     * @todo remove any
     */
    private serverFilesystemStorage: FileSystemStorage = new FileSystemStorage();

    public constructor(
        private serverSetting: WorkspaceSetting,
        private uri: string
    ) {
        this.serverStorage = container.resolve(ConnectionStorage);
        this.connectionModel = new ConnectionModel(serverSetting.connection);
    }

    public get workspacePath(): string {
        return this.uri;
    }

    public get serverSettings(): WorkspaceSetting {
        return JSON.parse(JSON.stringify(this.serverSetting));
    }

    public get fileSystemStorage(): FileSystemStorage {
        return this.serverFilesystemStorage;
    }

    /**
     * runs a connection request
     */
    public connect(): Promise<boolean> {
        const data = this.serverStorage.read(JSON.stringify(this.serverSetting.connection));
        this.connectionModel.cookies = data?.cookies ?? [];

        return this.serverExists().pipe(
            switchMap(() => this.checkCertificate()),
            switchMap(() => this.authorize()),
            tap(() => this.onConnected()),
            catchError((error) => {
                const message = `Could not connect to server ${this.connectionModel.setting.host}\nmessage: ${error.message}`;
                vscode.window.showErrorMessage(message);
                return of(false);
            }),
            take(1)
        ).toPromise();
    }

    /**
     * disconnect
     */
    public destroy() {
        this.destroy$.next(true);
        this.destroy$.complete();

        this.engimaProvider?.destroy();
        this.fileSystemStorage.clear();

        /** @todo move outside ? */
        this.serverStorage.delete(JSON.stringify(this.serverSetting.connection));
        this.connectionModel.state = ConnectionState.CLOSED;
    }

    public closeSession(appId?: string): Promise<void> {
        return this.engimaProvider.close(appId);
    }

    public openSession(appId?: string): Promise<EngineAPI.IGlobal | undefined> {
        return this.engimaProvider.open(appId);
    }

    /**
     * send head request to server just to check we can reach this one
     */
    private serverExists(): Observable<void> {
        const url = ConnectionHelper.buildUrl(this.serverSetting.connection);
        const req = new Promise<request.Request>((resolve) => {
            request.head({
                url,
                port: this.serverSetting.connection.port,
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

        if (this.serverSetting.connection.secure) {
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
                port: this.serverSetting.connection.port ?? 443,
                host: this.serverSetting.connection.host,
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
    private async acceptUntrusted(): Promise<boolean> {
        const selection = await vscode.window.showQuickPick(
            [{label: 'yes'}, {label: 'no'}],
            {
                placeHolder: 'Current connection is not secure, continue ?',
                canPickMany: false,
                ignoreFocusOut: true
            }
        );

        if (!selection) {
            return false;
        }

        const allowUntrusted = selection.label === 'yes';
        this.connectionModel.isUntrusted = allowUntrusted;
        return allowUntrusted;
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
        const strategyConstructor = await AuthorizationHelper.resolveStrategy(this.serverSetting.connection.authorization.strategy);

        if (strategyConstructor && authState.loginUri) {
            const strategy = new strategyConstructor({
                allowUntrusted: this.connectionModel.isUntrusted,
                uri: authState.loginUri as string,
                domain: this.serverSetting.connection.authorization.data.domain,
                password: this.serverSetting.connection.authorization.data.password,
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
        this.serverStorage.write(JSON.stringify(this.serverSetting.connection), {cookies: this.connectionModel.cookies});
        this.engimaProvider = new EnigmaSession(this.connectionModel);

        const global: EngineAPI.IGlobal = await this.engimaProvider.open("engineData", true) as EngineAPI.IGlobal;

        /** heartbeat */
        timer(5000, 5000).pipe(
            throttle(() => global.engineVersion()),
            takeUntil(this.destroy$)
        ).subscribe({
            error: () => {
                vscode.window.showErrorMessage(`Sad but true, connection to server ${this.connectionModel.setting.host} has been gone.`);
                vscode.commands.executeCommand(`VsQlik.Connection.Remove`, this.workspacePath);
            }
        });
    }
}
