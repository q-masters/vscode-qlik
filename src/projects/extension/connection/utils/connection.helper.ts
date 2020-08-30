import * as vscode from "vscode";
import { buildUrl } from "enigma.js/sense-utilities";
import { create } from "enigma.js";
import schema from "enigma.js/schemas/12.20.0.json";
import WebSocket from "ws";
import { ConnectionSetting } from "../api";
import { ConnectionModel } from "../model/connection";
import { WorkspaceSetting } from "@vsqlik/settings/api";
import { container } from "tsyringe";
import { SettingsRepository } from "@vsqlik/settings/settings.repository";

export interface ConnectionSettingQuickPickItem extends vscode.QuickPickItem {
    setting: WorkspaceSetting
}

export abstract class ConnectionHelper {

    /**
     * build url by a given connection
     */
    public static buildUrl(connection: ConnectionSetting): string {

        const isSecure = connection.secure;
        const protocol = isSecure ? 'https://' : 'http://';

        try {
            const url = new URL(protocol + connection.host);
            url.pathname = connection.path ?? "";
            return url.toString();
        } catch (error) {
            console.dir(error);
            throw error;
        }
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
        id?: string
    ): enigmaJS.ISession {
        const url = this.buildEnigmaWebsocketUri(model.setting, id);
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
        const headers = { Cookie: "" };
        const uri = url || this.buildWebsocketUri(connection.setting);

        connection.cookies.forEach(cookie => {
            headers.Cookie = headers.Cookie.concat(`${cookie.name}=${cookie.value.toString()};`);
        });

        const ws = new WebSocket(uri, {
            headers,
            rejectUnauthorized: !connection.isUntrusted
        });

        /*
        ws.on("message", (e) => {
            console.dir(e);
        });

        ws.on("error", (e) => {
            console.dir(e);
        });
        */

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
    private static buildEnigmaWebsocketUri(connection: ConnectionSetting, id = "engineData"): string {
        const port = Number(connection.port);
        const options = {
            appId   : id,
            host    : connection.host,
            identity: Math.random().toString(32).substr(2),
            secure  : connection.secure,
            port    : port && !isNaN(port) ? port : connection.secure ? 443 : 80,
            subpath : connection.path ?? ""
        };
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
