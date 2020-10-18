import { AuthorizationSetting } from "projects/extension/authorization/api";
import { Storage } from "@core/storage";
import { AuthorizationStrategyConstructor } from "../../authorization/strategies/authorization.strategy";
import { InjectionToken } from "tsyringe";
import { VsQlikLogger } from "@vsqlik/logger";

export interface DisplaySettings {
    dimensions: boolean;
    measures: boolean;
    script: boolean;
    sheets: boolean;
    variables: boolean;
}

/** connection settings */
export interface ConnectionSetting {

    /**
     *
     */
    label: string;

    /**
     * host name
     */
    host: string;

    /**
     * only if a custom port is set, by default this is
     * 80 / 443
     */
    port?: number;

    /**
     * additional path (proxy)
     */
    path: string;

    /**
     * secure connection
     */
    secure: boolean;

    /**
     * authorization settings
     */
    authorization: AuthorizationSetting;

    ssl_fingerprint?: string;

    isQlikSenseDesktop: boolean;
}

export interface ConnectionConfiguration {

    id: string;

    /**
     * host name
     */
    host: string;

    /**
     * only if a custom port is set, by default this is
     * 80 / 443
     */
    port?: number;

    /**
     * additional path (proxy)
     */
    path: string;

    /**
     * secure connection
     */
    secure: boolean;

    /**
     * secure connection
     */
    strategy: AuthorizationStrategyConstructor;

    /**
     * storage to write connection specific data
     */
    storage?: Storage;

    isQlikSenseDesktop: boolean;
}

export const enum COMMANDS {
    CONNECT = 'VsQlik.Connection.Connect',
    DISCONNECT = 'VsQlik.Connection.Disconnect',
}

export const VsQlikLoggerConnection: InjectionToken<VsQlikLogger> = `VsQlik Logger Connection`;
