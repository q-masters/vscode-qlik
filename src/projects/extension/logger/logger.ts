import { MESSAGE } from "triple-beam";
import { singleton } from "tsyringe";
import * as winston from "winston";
import { VsQlikOutputChannelTransport } from "./out-channel";

export class VsQlikLoggerToken {

    public constructor(
        private name: string
    ) {}

    public get context(): string {
        return this.name;
    }
}

enum LogLevel {
    DEBUG,
    ERROR,
    WARN,
    INFO
}

@singleton()
export class VsQlikLoggerResolver {

    private loggers: WeakMap<VsQlikLoggerToken, VsQlikLogger> = new WeakMap();

    private logger: winston.Logger;

    private globalContext = new VsQlikLoggerToken(`VsQlik`);

    /**
     *
     */
    public resolve(token = this.globalContext): VsQlikLogger {
        if (!this.loggers.has(token)) {
            this.createChild(token);
        }
        return this.loggers.get(token) as VsQlikLogger;
    }

    private initializeLogger() {
        this.logger = winston.createLogger({
            levels: {
                'off': -1,
                'info': 0,
                'warning': 1,
                'error': 2,
                'debug': 3
            },
            transports: [
                /**
                 * log directlyc
                 */
                new VsQlikOutputChannelTransport({
                    level: 'debug',
                    format: winston.format.combine(
                        this.formatTime(),
                        this.formatMessage(),
                    )
                }),
                /**
                 * @see https://github.com/Microsoft/vscode/issues/47881#issuecomment-381910587
                 *
                 * to ensure we get all informations for delveopment reasons log into a file
                 */
                new winston.transports.File({
                    filename: `${new Date().toISOString().replace(/T.+$/, '')}.vsqlik.log`
                })
            ],
            defaultMeta: {
                context: this.globalContext.context
            }
        });
    }

    /**
     *
     */
    private createChild(token: VsQlikLoggerToken): VsQlikLogger {
        if (!this.loggers.has(token)) {
            const childLogger = this.logger.child({label: token.context});
            this.loggers.set(token, new Logger(childLogger));
        }
        return this.loggers.get(token) as VsQlikLogger;
    }

    /**
     * format time
     */
    private formatTime(): winston.Logform.Format {
        return winston.format((data) => {
            const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            data['timestamp'] = date;
            return data;
        })();
    }

    /**
     * format output message
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
