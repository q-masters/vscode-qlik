import * as vscode from 'vscode';
import { container } from 'tsyringe';
import { ConnectionProvider } from '../utils/connection.provider';
import { VsQlikLoggerConnection } from '@vsqlik/logger/api';

export function ServerDisconnectCommand(workspace: vscode.WorkspaceFolder): void {
    const connectionProvider = container.resolve(ConnectionProvider);
    const logger = container.resolve(VsQlikLoggerConnection);

    logger.info(`close connection to ${workspace.name}`);
    connectionProvider.close(workspace.uri.toString(true));
}
