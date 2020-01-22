import { ConnectionWebview } from "./settings/src/connection.view";

export enum ConnectionAction {
    CREATE
}

export class Connection {

    private static instance: Connection;

    private connectionWebview: ConnectionWebview;

    private constructor() {
        this.connectionWebview = new ConnectionWebview();
    }

    public static run(action: ConnectionAction) {

        if (!Connection.instance) {
            Connection.instance = new Connection();
        }

        switch (action) {
            case ConnectionAction.CREATE: 
                this.instance.showWebview();
                break;
        }
    }

    private showWebview() {
        this.connectionWebview.render();
    }
}
