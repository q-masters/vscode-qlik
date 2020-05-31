import { WorkspaceSetting } from "backup/libs/settings/api";

export class WorkspaceFolder {

    public get settings(): WorkspaceSetting | undefined {
        return void 0;
    }

    public get isConnected(): boolean {
        return false;
    }
}
