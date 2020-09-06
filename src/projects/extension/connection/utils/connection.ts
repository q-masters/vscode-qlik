import * as vscode from "vscode";
import { Subject, of, Observable, timer, BehaviorSubject } from "rxjs";
import { container } from "tsyringe";
import { switchMap, tap, catchError, take, throttle, takeUntil } from "rxjs/operators";

import { Storage } from "@core/storage";
import { ConnectionStorage } from "@data/tokens";
import { AuthorizationService } from "@auth/utils/authorization.service";
import { AuthorizationState } from "@auth/strategies/authorization.strategy";

import { ConnectionState, ConnectionModel } from "../model/connection";
import { ConnectionHelper } from "./connection.helper";
import { EnigmaSession } from "./enigma.provider";
import { WorkspaceSetting } from "@vsqlik/settings/api";
import { FileSystemStorage } from "@vsqlik/fs/utils/file-system.storage";
import { fetchServerInformation } from "../commands/fetch-server-informations";

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

    private stateChange$: BehaviorSubject<ConnectionState> = new BehaviorSubject(ConnectionState.CLOSED);

    /**
     * one stream to unsubscribe everything
     */
    private destroy$: Subject<boolean> = new Subject();

    /**
     */
    private serverFilesystem: FileSystemStorage = new FileSystemStorage();

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

    public get fileSystem(): FileSystemStorage {
        return this.serverFilesystem;
    }

    public get stateChange(): Observable<ConnectionState> {
        return this.stateChange$.asObservable();
    }

    /**
     * runs a connection request
     */
    public connect(): Promise<boolean> {
        const data = this.serverStorage.read(JSON.stringify(this.serverSetting.connection));
        this.connectionModel.cookies = data?.cookies ?? [];

        return fetchServerInformation(this.serverSetting.connection).pipe(
            switchMap((res) => !res.trusted ? this.acceptUntrusted(res.fingerPrint) : of(true)),
            switchMap(() => this.authorize()),
            tap(() => this.onConnected()),
            catchError((error) => {
                const message = `Could not connect to server ${this.connectionModel.setting.host}\nmessage: ${error?.message ?? error}`;
                vscode.window.showErrorMessage(message);
                this.stateChange$.next(ConnectionState.ERROR);
                return of(false);
            }),
            take(1)
        ).toPromise();
    }

    /**
     * disconnect
     */
    public destroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();

        this.engimaProvider?.destroy();
        this.fileSystem.clear();

        /** @todo move outside ? */
        this.serverStorage.delete(JSON.stringify(this.serverSetting.connection));
        this.connectionModel.state = ConnectionState.CLOSED;
        this.stateChange$.next(ConnectionState.CLOSED);
    }

    public closeSession(appId?: string): Promise<void> {
        return this.engimaProvider.close(appId);
    }

    public openSession(appId?: string): Promise<EngineAPI.IGlobal | undefined> {
        return this.engimaProvider.open(appId);
    }

    public createSession(keepAlive = false): Promise<EngineAPI.IGlobal | undefined> {
        return this.engimaProvider.createSession(keepAlive);
    }

    /**
     * certificate was not secure, show dialog the user can accept it anyways
     * or decline
     *
     * to much vscode inside
     */
    private acceptUntrusted(fingerprint: string): Promise<boolean> {
        return new Promise((resolve) => {

            if (this.serverSettings.connection.ssl_fingerprint === fingerprint) {
                this.connectionModel.isUntrusted = true;
                resolve(true);
            } else {
                const quickPick = vscode.window.createQuickPick();
                quickPick.items = [{label: 'abort'}, {label: `trust: ${fingerprint}`}, {label: 'allways trust'}];
                quickPick.ignoreFocusOut = true;
                quickPick.canSelectMany = false;
                quickPick.title = `Connection for ${this.serverSetting.label} (${this.serverSetting.connection.host}) is not secure.`;
                quickPick.onDidChangeSelection((selected) => {
                    switch (selected[0]) {
                        case quickPick.items[0]:
                            resolve(false);
                            break;
                        case quickPick.items[2]:
                            /** patch settings and add ssl fingerprint to settings */
                            vscode.commands.executeCommand( 'VsQlik.Settings.Update', this.serverSetting, {connection:{ ssl_fingerprint: fingerprint }});
                        // eslint-disable-next-line no-fallthrough
                        default:
                            this.connectionModel.isUntrusted = true;
                            resolve(true);
                    }
                    quickPick.dispose();
                });
                quickPick.show();
            }
        });
    }

    /**
     * check current authorization state, if we have to login
     * run authorization by strategy
     */
    private async authorize(): Promise<boolean> {

        /** this also happens we are automatically logged in */
        const authState = await this.checkAuthState();
        if (authState.authorized) {
            return true;
        }

        const authService = container.resolve(AuthorizationService);
        const authResult = await authService.authorize({
            allowUntrusted: this.connectionModel.isUntrusted,
            credentials: this.serverSetting.connection.authorization.data,
            name: this.connectionModel.setting.host,
            strategy: this.serverSetting.connection.authorization.strategy,
            uri: authState.loginUri,
        });

        if (authResult.success) {
            this.connectionModel.cookies = authResult.cookies;
            return true;
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
                        console.log(response);
                        reject(response);
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

        const global: EngineAPI.IGlobal = await this.engimaProvider.open('engineData', true) as EngineAPI.IGlobal;
        const isQlikCore = (await global?.getConfiguration())?.qFeatures.qIsDesktop;

        /**
         * by default add a setting for max sessions, qlik core only needs this if this is a none licensed
         * version otherwise we could open more sessions for qlik sense desktop is no limit
         */
        this.engimaProvider.maxSessions = isQlikCore ? 5 : -1;

        this.stateChange$.next(ConnectionState.CONNECTED);

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
