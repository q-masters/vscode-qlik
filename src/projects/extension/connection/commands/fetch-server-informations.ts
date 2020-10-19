import { Observable, of, from, concat, throwError } from 'rxjs';
import { retryWhen, take, tap, switchMap, map, takeWhile, catchError } from 'rxjs/operators';
import { Agent } from 'https';
import fetch from 'node-fetch';
import { ConnectionSetting, VsQlikLoggerConnection } from '../api';
import { ConnectionHelper } from '../utils/connection.helper';
import { connect as tlsConnect} from "tls";
import { container } from 'tsyringe';

interface ServerInformation {
    exists: boolean;
    trusted: boolean;
    fingerPrint: string;
}

export function fetchServerInformation(setting: ConnectionSetting): Observable<ServerInformation> {

    const logger = container.resolve(VsQlikLoggerConnection);
    const connect$ = setting.secure ? connectSecure(setting) : connectUnsecure(setting);

    return connect$.pipe(
        catchError((error) => {
            logger.error(`could not connect to ${setting.label}`);
            throw error;
        }),
        take(1)
    );
}

/**
 * try at least 2 times
 *
 * first try check qlik sense enterprise
 * second try check qlik sense desktop add /hub at the end
 */
function connectUnsecure(setting: ConnectionSetting): Observable<ServerInformation> {

    let uri = ConnectionHelper.buildUrl(setting);
    let tryCount = 0;

    return of(true).pipe(
        switchMap(() => fetch(uri, { method: 'GET'})),
        retryWhen((errors) => errors.pipe(
            tap(() => (tryCount += 1, uri += '/hub')),
            takeWhile(() => tryCount < 2),
            (o) => concat(o, throwError(`Server not found`))
        )),
        map(() => ({ exists: true, trusted: true, fingerPrint: '' })));
}

/**
 * try at least 2 times for
 * Qlik Sense Server / Docker with rejectUnauthorized
 */
function connectSecure(setting: ConnectionSetting): Observable<ServerInformation> {
    const url = ConnectionHelper.buildUrl(setting);
    let tryCount = 0;

    return of(true).pipe(
        switchMap(() => fetch(url, {
            method: 'GET',
            agent: new Agent({rejectUnauthorized: tryCount === 0})
        })),
        retryWhen((errors) => errors.pipe(
            tap(() => tryCount += 1),
            takeWhile(() => tryCount < 2),
            (o) => concat(o, throwError(`Server not found`))
        )),
        switchMap(() => {
            const result = {exists: true, trusted: tryCount === 0, fingerPrint: ''};
            return tryCount > 0
                ? from(getFingerPrint(setting)).pipe(
                    map((fingerPrint: string) => Object.assign(result, {fingerPrint})))
                : of(result);
        })
    );
}

function getFingerPrint(setting: ConnectionSetting): Promise<string> {

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
