import * as vscode from "vscode";
import request from "request";
import { Response } from "request";
import { SessionCookie, AuthorizationStrategy,  } from "../../api";

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
            console.log(error);
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
            uri: `http://${this.connectionSetting.host}`,
            method: "GET"
        };

        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
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
     * create login process input fields
     */
    private async resolveLoginCredentials() {

        const credentials = {
            domain: { prompt: "Domain\\User" },
            password: { prompt: "password", password: true}
        } 

        const loginData = { domain: "", password: "" };
        const steps = Object.keys(credentials);

        for(let i = 0, ln = steps.length; i < ln; i++) {
            const step   = steps[i];
            const option = credentials[step];
            const value  = await vscode.window.showInputBox(option);

            loginData[step] = value;
        }

        return loginData;
    }
}
