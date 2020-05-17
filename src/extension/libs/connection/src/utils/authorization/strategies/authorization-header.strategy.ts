import { SessionCookie  } from "../../../api";
import { AuthorizationStrategy } from "./authorization.strategy";
import { Stepper, InputStep } from "@lib/stepper";
import { RequestOptions as RequestOptionsHttp, request, IncomingMessage } from "http";

interface Credentials {
    domain: string;
    password: string;
}

/**
 * try send Authorization Header
 *
 * @example
 * {
 *   Authorization: Basic domain\user:password (base64 encoded)
 * }
 */
export class AuthorizatioHeaderStrategy extends AuthorizationStrategy {

    private cookies: SessionCookie[];

    public async run(): Promise<boolean>
    {
        try {
            const loginCredentials   = await this.resolveLoginCredentials();
            return this.sendRequest(loginCredentials);
        } catch (error) {
            /** @todo log error not console.log */
            console.error(error);
            return false;
        }
        return true;
    }

    public get sessionCookies(): SessionCookie[] {
        return this.cookies;
    }

    private sendRequest(credentials: Credentials): Promise<true> {

        const encodedLoginCredentials = this.encodeLoginCredentials(credentials);
        const requestOptions: RequestOptionsHttp = {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${encodedLoginCredentials}`
            },
            host: 'windows-10-privat.shared'
        };

        request(requestOptions, (response: IncomingMessage) => {
            console.log(response);
        });
        return Promise.resolve(true);
    }

    private encodeLoginCredentials(credentials: Credentials): string {
        const source = credentials.domain + ':' + credentials.password;
        return Buffer.from(source).toString('base64');
    }

    /**
     * show input fields
     */
    private async resolveLoginCredentials(): Promise<Credentials> {

        const domainStep   = new InputStep(`Domain`, this.connectionSetting.host);
        const userStep     = new InputStep(`UserDirectory`, this.connectionSetting.host);
        const passwordStep = new InputStep(`Password`, this.connectionSetting.host, true);

        const stepper  = new Stepper(this.title);
        stepper.addStep(domainStep);
        stepper.addStep(userStep);
        stepper.addStep(passwordStep);

        const [domain, username, password] = await stepper.run<string>();

        if (!domain || !password) {
            throw new Error("could not resolve credentials");
        }

        return {
            domain: `${domain}\\${username as string}`,
            password
        };
    }
}
