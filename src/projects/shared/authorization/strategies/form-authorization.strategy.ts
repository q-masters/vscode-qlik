import request from "request";
import { Response } from "request";
import { AuthorizationStrategy, AuthorizationResult } from "./authorization.strategy";
import { AuthorizationSetting } from "../api";
import WebSocket from "ws";
import { IncomingMessage } from "http";

interface Credentials {
    domain: string;
    password: string;
}

/**
 * login to qlik with form strategy
 */
abstract class FormAuthorizationStrategy extends AuthorizationStrategy {

    public async run(): Promise<AuthorizationResult>
    {
        const response: AuthorizationResult = {
            success: false,
            cookies: [],
            error: ""
        };

        const {domain, password} = await this.resolveCredentials(this.connection.authorization);

        try {
            const redirectUri = await this.submitForm(domain, password);
            const cookies     = await this.finalizeLoginProcess(redirectUri);

            response.success = true;
            response.cookies = cookies;
        } catch (error) {
            console.log(error);
            response.error   = error;
            response.success = false;
        }

        return response;
    }

    protected abstract resolveCredentials(settings: AuthorizationSetting<any>): Promise<{domain: string; password: string;}>;

    /**
     * submit form data and returns a redirect uri
     */
    private submitForm(username: string, password: string): Promise<string>
    {
        const body = `username=${username}&pwd=${password}`;
        const headers = {
            "Content-length": body.length,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        return new Promise((resolve, reject) => {
            const options = { body, headers, method: "POST", uri: this.loginUrl };
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
    private finalizeLoginProcess(uri: string): Promise<any[]>
    {
        const ws = new WebSocket(uri);
        let result;

        return new Promise((resolve, reject) => {
            ws.on("close", () => result ? resolve(result) : reject());
            ws.once("upgrade", (res: IncomingMessage) => {
                /**
                 * @example respsonse
                 * set-cookie:Array[1]
                 *   0:"X-Qlik-Session-HTTP=eccfad38-8851-4064-85fd-79c1d0a6bc84; Path=/; HttpOnly"
                 */
                const cookies = res.headers['set-cookie']?.map((cookieData: string) =>  {
                    const [name, value] = cookieData.split("=");
                    return {name, value};
                });

                result = cookies;
                ws.close();
            });
        });
    }
}

export default FormAuthorizationStrategy;
