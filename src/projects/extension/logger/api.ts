import { InjectionToken, container } from "tsyringe";
import { VsQlikLogger, VsQlikLoggerResolver, VsQlikLoggerToken } from "./logger";

export enum LogLevel {
    off,
    debug,
    info,
    warn,
    error
}

/**
 * logger
 */
export const VsQlikLoggerConnection: InjectionToken<VsQlikLogger> = `VsQlik Logger Connection`;
export const VsQlikLoggerScript: InjectionToken<VsQlikLogger> = `VsQlik Logger Script`;
export const VsQlikLoggerQixFs: InjectionToken<VsQlikLogger> = `VsQlik Logger Qix FS`;

function LoggerFactory(label: string) {
    const resolver = container.resolve(VsQlikLoggerResolver);
    const token    = new VsQlikLoggerToken(label);

    return () => resolver.resolve(token);
}

container.register(VsQlikLoggerConnection, { useFactory: LoggerFactory(`VsQlik.Connection`) });
container.register(VsQlikLoggerQixFs,      { useFactory: LoggerFactory(`VsQlik.QixFS`) });
container.register(VsQlikLoggerScript,     { useFactory: LoggerFactory(`VsQlik.Script`) });
