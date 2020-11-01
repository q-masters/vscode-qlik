import * as vscode from "vscode";
import { buildUrl } from "enigma.js/sense-utilities";
import { create } from "enigma.js";
import schema from "enigma.js/schemas/12.20.0.json";
import WebSocket from "ws";
import { WorkspaceSetting } from "@vsqlik/settings/api";
import { container, singleton } from "tsyringe";
import { SettingsRepository } from "@vsqlik/settings/settings.repository";
import { VsQlikLoggerWebsocket } from "@vsqlik/logger";
import { ConnectionSetting } from "../api";
import { ConnectionModel } from "../model/connection";

export interface ConnectionSettingQuickPickItem extends vscode.QuickPickItem {
    setting: WorkspaceSetting
}

@singleton()
export class ConnectionHelper {

    /**
     * build url by a given connection
     */
    public static buildUrl(connection: ConnectionSetting): string {

        const isSecure = connection.secure;
        const protocol = isSecure ? 'https://' : 'http://';
        const url = new URL(protocol + connection.host);
        url.port  = connection.port?.toString() ?? "";
        url.pathname = connection.path ?? "";

        return url.toString();
    }

    /**
     * open a new websocket connection to qlik
     *
     * @static
     * @param {string} url for the websocket connection
     * @param {ConnectionData} data additional data for the websocket
     */
    public static createEnigmaSession(
        model: ConnectionModel,
        id?: string,
        uniqe = true
    ): enigmaJS.ISession {
        const url = this.buildEnigmaWebsocketUri(model.setting, id, uniqe);
        return create({
            schema,
            url,
            createSocket: (url) => this.createWebsocket(model, url)
        });
    }

    /**
     * create a new websocket connection with a given connection
     * @todo refactor this
     */
    public static createWebsocket(connection: ConnectionModel, url?: string): WebSocket {
        const logger = container.resolve(VsQlikLoggerWebsocket);

        const headers = { Cookie: "" };
        const uri = url || this.buildWebsocketUri(connection.setting);

        connection.cookies.forEach(cookie => {
            headers.Cookie = headers.Cookie.concat(`${cookie.name}=${cookie.value.toString()};`);
        });

        const ws = new WebSocket(uri, {
            headers,
            rejectUnauthorized: !connection.isUntrusted
        });

        logger.debug(uri);

        ws.on("message", (message) => logger.verbose(message.toString()));
        ws.on("error", (e) => logger.error(`${connection.setting.label} ${e.message}`));
        return ws;
    }

    /**
     * resolve connection from settings
     */
    public static async selectConnection(): Promise<WorkspaceSetting|undefined> {
        const settingsRepository   = container.resolve<SettingsRepository>(SettingsRepository);
        const availableConnections = settingsRepository.read();

        if (availableConnections.length > 0) {
            const items = availableConnections.map<ConnectionSettingQuickPickItem>((setting) => ({label: setting.label, setting }));
            const selection = await vscode.window.showQuickPick(items, {placeHolder: "Select Connection"});
            return selection?.setting;
        }

        return void 0;
    }

    /**
     * create a websocket url by a given connection
     */
    private static buildEnigmaWebsocketUri(connection: ConnectionSetting, id = "engineData", uniqe = true): string {
        const port = Number(connection.port);

        let options: any = {
            appId   : id,
            host    : connection.host,
            secure  : connection.secure,
            port    : port && !isNaN(port) ? port : connection.secure ? 443 : 80,
            subpath : connection.path ?? ""
        };

        if (uniqe) {
            options = {
                ...options,
                identity: Math.random().toString(32).substr(2)
            };
        }

        return buildUrl(options);
    }

    private static buildWebsocketUri(setting: ConnectionSetting): string {
        const isSecure = setting.secure;
        const protocol = isSecure ? 'wss://' : 'ws://';
        const host     = setting.host;
        const port     = setting.port ? `:${setting.port}`: '';
        const subpath  = setting.path ?? '';

        return [protocol, host, port, subpath].join('');
    }
}
