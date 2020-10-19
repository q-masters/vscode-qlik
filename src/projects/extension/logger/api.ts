import * as vscode from 'vscode';
import { InjectionToken, container } from "tsyringe";
import { VsQlikLogger, VsQlikLoggerResolver, VsQlikLoggerToken } from "./logger";
import { AbstractConfigSetLevels } from 'winston/lib/winston/config';

export const VsQlikLogLevels: AbstractConfigSetLevels = {
    off  : -1,
    fatal : 0,
    error : 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
};

declare type LogLevel = 'off' | 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * settings
 */
export interface VsQlikLoggerSetting {

    vscodeOutputChannel: {
        level: LogLevel;
    };

    fileChannel: {
        level: LogLevel;
        outDir: string; /** path to output directory for the log files */
    };
}

export const VsQlikLogSettings: InjectionToken<VsQlikLoggerSetting> = `VsQlik Logger Settings`;
container.register(VsQlikLogSettings, {
    useValue: vscode.workspace.getConfiguration().get('VsQlik.Logger')
});

/**
 * logger
 */
export const VsQlikLoggerScript: InjectionToken<VsQlikLogger>     = `VsQlik Logger Script`;
export const VsQlikLoggerQixFs: InjectionToken<VsQlikLogger>      = `VsQlik Logger Qix FS`;
export const VsQlikLoggerGlobal: InjectionToken<VsQlikLogger>     = `VsQlik Global Logger`;
export const VsQlikLoggerWebsocket: InjectionToken<VsQlikLogger>  = `VsQlik Websocket Logger`;

export function LoggerFactory(label: string): () => VsQlikLogger {
    const resolver = container.resolve(VsQlikLoggerResolver);
    const token    = new VsQlikLoggerToken(label);

    return () => resolver.resolve(token);
}

container.register(VsQlikLoggerGlobal,     { useFactory: LoggerFactory(`VsQlik`) });
container.register(VsQlikLoggerQixFs,      { useFactory: LoggerFactory(`VsQlik QixFS`) });
container.register(VsQlikLoggerScript,     { useFactory: LoggerFactory(`VsQlik Script`) });
container.register(VsQlikLoggerWebsocket,  { useFactory: LoggerFactory(`VsQlik Websocket`) });
