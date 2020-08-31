import { throwError, Observable, of, from } from 'rxjs';
import { retryWhen, take, concat, tap, switchMap, map, takeWhile } from 'rxjs/operators';
import { Agent } from 'https';
import fetch from 'node-fetch';
import { ConnectionSetting } from '../api';
import { ConnectionHelper } from '../utils/connection.helper';
import { connect as tlsConnect} from "tls";

interface ServerInformation {
    exists: boolean;
    trusted: boolean;
    fingerPrint: string;
}

export function fetchServerInformation(setting: ConnectionSetting): Observable<ServerInformation> {

    const url = ConnectionHelper.buildUrl(setting);
    let tryCount = setting.secure ? 0 : 1;

    /**
     * for https connections try at least 2 times:
     * 1. run with rejectUnauthorized: true if this works the server exists and has a valid certificate
     * 2. run with rejectUnauthorized: false if this works server exists but no valid certificate
     *
     * if not secure only 1 try
     */
    return of(true).pipe(
        switchMap(() => fetch(url, {
            method: 'GET',
            ...(setting.secure ? {agent: new Agent({rejectUnauthorized: !tryCount})} : {})
        })),
        retryWhen((errors) => errors.pipe(
            tap(() => tryCount += 1),
            takeWhile(() => tryCount < 2),
            concat(throwError(`Server not found: ${setting.host}`)),
        )),
        map(() => ({ exists: true, trusted: tryCount === 0, fingerPrint: ''})),
        /**
         * get finger print from server and add this to the server informations
         */
        switchMap((res) => {
            return from(getFingerPrint(setting)).pipe(map((fingerPrint) => Object.assign(res, {fingerPrint})));
        }),
        take(1)
    );
}

function getFingerPrint(setting: ConnectionSetting): Promise<string> {

    if (!setting.secure) {
        return Promise.resolve('');
    }

    return new Promise((resolve) => {
        const socket = tlsConnect({
            port: setting.port ?? 443,
            host: setting.host,
            rejectUnauthorized: false
        }, () => {
            const certificate = socket.getPeerCertificate();
            resolve(certificate.fingerprint256);
        });
    });
}
