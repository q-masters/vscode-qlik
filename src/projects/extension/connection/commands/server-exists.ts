import { from, throwError, Observable } from 'rxjs';
import { retryWhen, take, delay, concat } from 'rxjs/operators';
import { Agent } from 'https';
import fetch from 'node-fetch';
import { ConnectionSetting } from '../api';
import { ConnectionHelper } from '../utils/connection.helper';

export function serverExists(setting: ConnectionSetting): Observable<any> {

    const url = ConnectionHelper.buildUrl(setting);
    const req = fetch(url, Object.assign({
        method: 'HEAD',
        ...(setting.secure ? {agent: new Agent({rejectUnauthorized: false})} : {})
    }));

    return from(req).pipe(
        retryWhen((errors) => errors.pipe(
            delay(2000),
            take(3),
            concat(throwError(`Server not found: ${setting.host}`))
        ))
    );
}
