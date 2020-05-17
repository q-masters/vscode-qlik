import request from "request";
import { Response } from "request";
import { SessionCookie  } from "../../../api";
import { AuthorizationStrategy } from "./authorization.strategy";
import { Stepper, InputStep } from "@lib/stepper";

interface Credentials {
    domain: string;
    password: string;
}

/**
 * login to qlik with form strategy
 */
export class FormAuthorizationStrategy extends AuthorizationStrategy {

    private cookies: SessionCookie[];

    public async run(): Promise<boolean>
    {
        try {
            const loginCredentials = await this.resolveLoginCredentials();
            const formUri          = await this.initializeLoginProcess();
            const redirectUri      = await this.submitForm(formUri, loginCredentials.domain, loginCredentials.password);
            await this.finalizeLoginProcess(redirectUri);
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

    /**
     * initialize login process by call server directly
     * this returns an login form by default if this running
     * against a qlik server.
     *
     * this uri is required since it contains a ticket id
     */
    private initializeLoginProcess(): Promise<string> {

        const options = {
            uri: `http://${this.connectionSetting.host as string}`,
            method: "GET"
        };

        return new Promise((resolve, reject) => {
            request(options, (error, response) => {
                if (error) {
                    reject(error);
                }
                resolve(response.request.uri.href);
            });
        });
    }

    /**
     * submit form data and returns a redirect uri
     */
    private submitForm(uri: string, username: string, password: string): Promise<string> {
        const body = `username=${username}&pwd=${password}`;
        const headers = {
            "Content-length": body.length,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        return new Promise((resolve, reject) => {
            const options = { body, headers, method: "POST", uri };
            request(options, (error, response: Response) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (response.statusCode !== 302) {
                    reject(response.statusMessage);
                    return;
                }

                resolve(response.headers.location);
            });
        });
    }

    /**
     * finalize login process, since we know now the redirect uri which is called
     * after login is working
     */
    private finalizeLoginProcess(uri: string): Promise<SessionCookie[]> {
        return new Promise((resolve, reject) => {
            const options = { method: "GET", uri };
            request(options, (error, response: Response) => {

                if (error) {
                    reject(error);
                    return;
                }
                /**
                 * @example respsonse
                 * set-cookie:Array[1]
                 *   0:"X-Qlik-Session-HTTP=eccfad38-8851-4064-85fd-79c1d0a6bc84; Path=/; HttpOnly"
                 */
                this.cookies = response.headers['set-cookie']
                    /** remove Path and HttpOnly from cookie we dont care */
                    .map((cookie) => cookie.split(";")[0])
                    /** split every cookie by = and map to key, value pair */
                    .map((cookieData: string) =>  {
                        const [name, value] = cookieData.split("=");
                        return {name, value};
                    });

                resolve([]);
            });
        });
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
