import * as vscode from "vscode";
import { Subject, of, Observable, timer, BehaviorSubject } from "rxjs";
import { container } from "tsyringe";
import { switchMap, tap, catchError, take, throttle, takeUntil, map } from "rxjs/operators";

import { Storage } from "@core/storage";
import { ConnectionStorage } from "@data/tokens";
import { AuthorizationResult } from "@auth/strategies/authorization.strategy";

import { WorkspaceSetting } from "@vsqlik/settings/api";
import { FileSystemStorage } from "@vsqlik/fs/utils/file-system.storage";
import { VsQlikLogger } from "@vsqlik/logger";

import { ConnectionState, ConnectionModel } from "../model/connection";
import { VsQlikLoggerConnection } from "../api";
import { fetchServerInformation } from "../commands";
import { ConnectionHelper } from "./connection.helper";
import { EnigmaSession } from "./enigma.provider";
import { Application } from "./application";

/**
 * represents the connection to a server, which is a workspace folder in vscode
 * so this one should open new enigma sessions
 *
 */
export class Connection {

    private connectionModel: ConnectionModel;

    /**
     * handler for all enigma sessions
     *
     */
    private engimaProvider: EnigmaSession;

    /**
     * storage to save data
     *
     */
    private serverStorage: Storage;

    /**
     *
     *
     */
    private stateChange$: BehaviorSubject<ConnectionState> = new BehaviorSubject(ConnectionState.CLOSED);

    /**
     * one stream to unsubscribe everything
     *
     */
    private destroy$: Subject<boolean> = new Subject();

    /**
     * file mapping, so we could easier find a filesystem entry
     *
     */
    private serverFilesystem: FileSystemStorage = new FileSystemStorage();

    /**
     * open applications
     *
     */
    private applications: Map<string, Application> = new Map();

    /**
     * vsqlik logger for connections
     *
     */
    private logger: VsQlikLogger;

    public constructor(
        private serverSetting: WorkspaceSetting,
        private uri: string,
    ) {
        this.logger          = container.resolve(VsQlikLoggerConnection);
        this.serverStorage   = container.resolve(ConnectionStorage);
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

    public get model(): ConnectionModel {
        return this.connectionModel;
    }

    /**
     * runs a connection request
     *
     */
    public async connect(): Promise<boolean> {

        this.logger.info(`connect to server: ${this.serverSetting.connection.host}`);

        const connect$ = fetchServerInformation(this.serverSetting.connection).pipe(
            switchMap((res) => !res.trusted ? this.acceptUntrusted(res.fingerPrint) : of(true))
        );

        return connect$.pipe(
            switchMap(() => this.checkAuthState()),
            catchError((loginUri) => {
                /** @todo rework we could not change the settings since they are required for the sessin cache */
                const settings = this.serverSetting.connection;
                const untrusted = this.connectionModel.isUntrusted;
                return vscode.commands.executeCommand<AuthorizationResult>('vsqlik:auth.login', settings, loginUri, untrusted);
            }),
            tap((result) => this.connectionModel.cookies = result?.success ? result.cookies : []),
            tap(() => this.onConnected()),
            map(() => true),
            catchError((error) => {
                const message = `Could not connect to server ${this.connectionModel.setting.host}\nmessage: ${error?.message ?? error}`;
                vscode.window.showErrorMessage(message);
                this.stateChange$.next(ConnectionState.ERROR);
                this.logger.error(message);
                return of(false);
            })
        ).toPromise();
    }

    /**
     * disconnect
     *
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

    /**
     *
     *
     */
    public openSession(): Promise<EngineAPI.IGlobal | undefined> {
        return this.engimaProvider.open();
    }

    /**
     * create complete new independed session
     *
     */
    public createSession(keepAlive = false): Promise<EngineAPI.IGlobal | undefined> {
        return this.engimaProvider.createSession(keepAlive);
    }

    /**
     * create application wrapper for existing qlik app
     *
     */
    public async getApplication(id: string): Promise<Application> {
        if (!this.applications.has(id)) {
            const global = await this.engimaProvider.open(id);
            if (global) {
                const app = new Application(global, id, this.serverSetting.label);
                app.onClose()
                    .pipe(take(1))
                    .subscribe(() => this.applications.delete(id));

                /** cache app */
                this.applications.set(id, app);
            }
        }
        return this.applications.get(id) as Application;
    }

    /**
     * certificate was not secure, show dialog the user can accept it anyways
     * or decline
     *
     * to much vscode inside
     *
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
     * resolves current authorization state
     *
     * checks we have an active session via session cookie so we dont need to authorize again
     * and if not we got some authorization informations
     *
     */
    private async checkAuthState(): Promise<AuthorizationResult> {

        const sessionInfo = await vscode.commands.executeCommand<AuthorizationResult>('vsqlik:auth.session', this.serverSetting.connection);
        this.connectionModel.cookies = sessionInfo?.cookies ?? [];

        return new Promise((resolve, reject) => {
            const session = ConnectionHelper.createEnigmaSession(this.connectionModel);
            session.on("traffic:received", async (response) => {
                await session.close();
                switch (response.method) {
                    case 'OnAuthenticationInformation':
                        if (response.params.mustAuthenticate) {
                            // this.serverSetting.connection.authorization.loginUri = response.params.loginUri;
                            reject(response.params.loginUri);
                        }
                        break;

                    case 'OnConnected':
                        resolve({ success: true, cookies: sessionInfo?.cookies ?? [] });
                        break;

                    default:
                        reject(void 0);
                }
            });
            session.on('closed', () => (session as any).removeAllListeners());
            session.open();
        });
    }

    /**
     * we got connected to server
     *
     */
    private async onConnected() {

        this.engimaProvider = new EnigmaSession(this.connectionModel);

        const global: EngineAPI.IGlobal = await this.engimaProvider.open('engineData', true) as EngineAPI.IGlobal;
        const isQlikCore = (await global?.getConfiguration())?.qFeatures.qIsDesktop;

        /**
         * by default add a setting for max sessions, qlik core only needs this if this is a none licensed
         * version otherwise we could open more sessions for qlik sense desktop is no limit
         *
         */
        this.engimaProvider.maxSessions = isQlikCore ? 5 : -1;
        this.logger.info(`connected to server: ${this.serverSetting.connection.host}`);
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
