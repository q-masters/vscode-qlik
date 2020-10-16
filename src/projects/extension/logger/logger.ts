import * as path from "path";
import { MESSAGE } from "triple-beam";
import { container, inject, singleton } from "tsyringe";
import * as winston from "winston";
import { TransportStreamOptions } from "winston-transport";
import * as Transport from 'winston-transport';
import { FileTransportInstance, FileTransportOptions } from "winston/lib/winston/transports";
import { VsQlikLoggerSetting, VsQlikLogLevels, VsQlikLogSettings } from "./api";
import { VsQlikOutputChannelTransport } from "./out-channel";
import {existsSync, statSync } from "fs";

export class VsQlikLoggerToken {

    public constructor(
        private name: string
    ) {}

    public get context(): string {
        return this.name;
    }
}

@singleton()
export class VsQlikLoggerResolver {

    private loggers: WeakMap<VsQlikLoggerToken, VsQlikLogger> = new WeakMap();

    private logger: winston.Logger;

    private settings: VsQlikLoggerSetting;

    public constructor() {
        this.settings = container.resolve(VsQlikLogSettings);
    }

    /**
     * resolve a logger by token
     */
    public resolve(token: VsQlikLoggerToken): VsQlikLogger {
        if (!this.loggers.has(token)) {
            this.createChildLogger(token);
        }
        return this.loggers.get(token) as VsQlikLogger;
    }

    /**
     * create a base logger instance from winston
     * which is the root for all child loggers which exists
     */
    private createBaseLogger(): winston.Logger {

        const transports: Transport[] = [];
        const transportOptions: TransportStreamOptions = {
            format: winston.format.combine(
                this.formatTime(),
                this.flattenMessage(),
                this.formatMessage(),
            )
        };

        let enableFileTransport = this.settings.fileChannel.level !== 'off';
        enableFileTransport = enableFileTransport && existsSync(this.settings.fileChannel.outDir);
        enableFileTransport = enableFileTransport && statSync(this.settings.fileChannel.outDir).isDirectory();

        if (enableFileTransport) {
            transports.push(this.resolveFileTransport(transportOptions));
        }

        if (this.settings.vscodeOutputChannel.level !== `off`) {
            transports.push(new VsQlikOutputChannelTransport({
                ...transportOptions,
                level: this.settings.vscodeOutputChannel.level
            }));
        }

        return winston.createLogger({
            silent: transports.length === 0,
            levels: VsQlikLogLevels,
            transports
        });
    }

    /**
     * create a child logger with a specific label which extends the base logger
     */
    private createChildLogger(token: VsQlikLoggerToken): VsQlikLogger {

        if (!this.logger) {
            this.logger = this.createBaseLogger();
        }

        if (!this.loggers.has(token)) {
            const childLogger = this.logger.child({label: token.context});
            this.loggers.set(token, new Logger(childLogger));
        }
        return this.loggers.get(token) as VsQlikLogger;
    }

    /**
     * @see https://github.com/Microsoft/vscode/issues/47881#issuecomment-381910587
     *
     * create file log stream to ensure we get all informations for delveopment
     * reasons log into a file,
     */
    private resolveFileTransport(options: TransportStreamOptions): FileTransportInstance {
        /** file path should be read out of settings */
        const outDir = this.settings.fileChannel.outDir;
        const file = `${new Date().toISOString().replace(/T.+$/, '')}.vsqlik.log`;
        const streamOptions: FileTransportOptions = {
            ...options,
            filename: path.resolve(outDir, file),
            level: this.settings.fileChannel.level
        };
        return new winston.transports.File(streamOptions);
    }

    /**
     * winston formatter for time add timestamp to meta data in the format of
     * YYYY-MM-DD HH-MM-SS
     */
    private flattenMessage(): winston.Logform.Format {
        return winston.format((data) => {
            const message = data.message.replace(/[\r\n]+/gm, ' ');
            data.message  = message;
            return data;
        })();
    }

    /**
     * winston formatter for time add timestamp to meta data in the format of
     * YYYY-MM-DD HH-MM-SS
     */
    private formatTime(): winston.Logform.Format {
        return winston.format((data) => {
            const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            data['timestamp'] = date;
            return data;
        })();
    }

    /**
     * finalize output format for log messages in the format:
     *
     * [TIMESTAMP] [LOGGER_LABEL] [LEVEL] MESSAGE
     */
    private formatMessage() {
        return winston.format((data) => {
            const message = `[${data.timestamp}] [${data.label}] [${data.level}] ${data.message}`;
            data[MESSAGE as any] = message;
            return data;
        })();
    }
}

export interface VsQlikLogger {
    info(message: string): void;

    error(message: string): void;
}

/**
 * private class
 */
class Logger implements VsQlikLogger {

    public constructor(
       private logger: winston.Logger
    ) { }

    /**
     * log info message
     */
    public info(message: string): void {
        this.logger.info(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }
}
