import * as vscode from 'vscode';
import { container } from 'tsyringe';
import { ConnectionProvider } from '../utils/connection.provider';

export function ServerDisconnectCommand(workspace: vscode.WorkspaceFolder) {
    const connectionProvider = container.resolve(ConnectionProvider);
    connectionProvider.close(workspace.uri.toString(true));
}
