import * as vscode from "vscode";
import request from "request";
import { Response } from "request";
import { SessionCookie, AuthService } from "./api";

/**
 * login to qlik with form strategy
 */
export class FormAuthService implements AuthService {

    private cookies: SessionCookie[];

    public async authorize(uri: string): Promise<boolean>
    {
        try {
            const loginCredentials = await this.resolveLoginCredentials();
            const formUri          = await this.getFormUri(uri);
            const redirectUri      = await this.submitForm(formUri, loginCredentials.domain, loginCredentials.password);
            await this.finalizeLoginProcess(redirectUri);
        } catch (error) {
            /** @todo log error not console.log */
            console.log(error);
            return false;
        }
        return true;
    }

    public logout(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public get sessionCookies(): SessionCookie[] {
        return this.cookies;
    }

    /**
     * initialize form by calling the uri
     * which resolves the uri we have to send our post request
     * with login credentials
     */
    private getFormUri(uri: string): Promise<string> {

        const options = {
            uri,
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
                    console.log(error);
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
