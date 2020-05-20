import request from "request";
import { Response } from "request";
import { SessionCookie, FormAuthorizationData  } from "../../../api";
import { AuthorizationStrategy } from "./authorization.strategy";
import { Stepper, InputStep, IStep } from "@lib/stepper";
import { ResolvedStep } from "extension/libs/stepper/resolved-step";

interface Credentials {
    domain: string;
    password: string;
}

/**
 * login to qlik with form strategy
 */
export default class FormAuthorizationStrategy extends AuthorizationStrategy {

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
            uri: `http://${this.connection.host as string}`,
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

        const authData = this.connection.authorization.data as FormAuthorizationData;

        const stepper  = new Stepper(this.title);
        stepper.addStep(this.createStep(authData.domain));
        stepper.addStep(this.createStep(authData.username));
        stepper.addStep(this.createStep(authData.password));

        const [domain, username, password] = await stepper.run<string>();

        if (!domain || !username || !password) {
            throw new Error("could not resolve credentials");
        }

        console.log(domain, username, password);

        return {
            domain: `${domain}\\${username as string}`,
            password
        };
    }

    private createStep(value: string | undefined): IStep {
        if (!value || value.trim() === "") {
            return new InputStep("");
        }
        return new ResolvedStep(value);
    }
}
