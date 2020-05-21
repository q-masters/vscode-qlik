import request from "request";
import { Response } from "request";
import { Stepper, InputStep, IStep, ResolvedStep } from "@lib/stepper";
import { FormAuthorizationData, Cookie  } from "../../../api";
import { ConnectionHelper } from "../../connection.helper";
import { AuthorizationStrategy, AuthorizationResult } from "./authorization.strategy";

interface Credentials {
    domain: string;
    password: string;
}

/**
 * login to qlik with form strategy
 */
export default class FormAuthorizationStrategy extends AuthorizationStrategy {

    public async run(): Promise<AuthorizationResult>
    {
        const response: AuthorizationResult = {
            success: false,
            cookies: []
        };

        try {
            const loginCredentials = await this.resolveLoginCredentials();
            const formUri          = await this.initializeLoginProcess();
            const redirectUri      = await this.submitForm(formUri, loginCredentials.domain, loginCredentials.password);
            const cookies          = await this.finalizeLoginProcess(redirectUri);

            response.success = true;
            response.cookies = cookies;

        } catch (error) {
            response.success = false;
        }

        return response;
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
            uri: ConnectionHelper.buildUrl(this.connection),
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
                console.dir(response);
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
    private finalizeLoginProcess(uri: string): Promise<Cookie[]> {
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
                const cookies: Cookie[] = response.headers['set-cookie']
                    /** remove Path and HttpOnly from cookie we dont care */
                    .map((cookie) => cookie.split(";")[0])
                    /** split every cookie by = and map to key, value pair */
                    .map((cookieData: string) =>  {
                        const [name, value] = cookieData.split("=");
                        return {name, value};
                    });

                resolve(cookies);
            });
        });
    }

    /**
     * show input fields
     */
    private async resolveLoginCredentials(): Promise<Credentials> {

        const authData = this.connection.authorization.data as FormAuthorizationData;

        const stepper  = new Stepper(this.title);
        stepper.addStep(this.createStep(authData.domain, "domain\\username"));
        stepper.addStep(this.createStep(authData.password, "password", true));

        const [domain, password] = await stepper.run<string>();

        if (!domain || !password) {
            throw new Error("could not resolve credentials");
        }

        return { domain, password };
    }

    private createStep(value: string | undefined, placeholder = "", password = false): IStep {
        if (!value || value.trim() === "") {
            return new InputStep(placeholder, this.connection.host, password);
        }
        return new ResolvedStep(value);
    }
}
