import request from "request";
import { Response } from "request";
import { IncomingMessage } from "http";
import WebSocket from "ws";
import { Stepper, IStep, InputStep, ResolvedStep } from "../../stepper";
import { AuthorizationResult, AuthorizationStrategy } from "./authorization.strategy";

/**
 * allowUntrusted
 * uri
 * credentials
 */

/**
 * login to qlik with form strategy
 */
export class FormAuthorizationStrategy extends AuthorizationStrategy {

    public async run(): Promise<AuthorizationResult> {

        const response: AuthorizationResult = {
            success: false,
            cookies: [],
            error: ""
        };

        try {
            const {domain, password} = await this.resolveCredentials();
            const redirectUri = await this.submitForm(this.loginUrl, domain, password, !this.untrusted);
            const cookies     = await this.finalizeLoginProcess(redirectUri, !this.untrusted);
            response.cookies = cookies;
            response.success = true;
        } catch (error) {
            response.error   = error;
            response.success = false;
        }

        return response;
    }

    /**
     * resolve login credentials via input steps in visual studio code
     */
    protected async resolveCredentials(): Promise<{ domain: string; password: string; }> {

        const title    = this.config.authorization.data.domain ?? '';
        const stepper  = new Stepper(`Login: ${title}@${this.config.label ?? ''}`);
        stepper.addStep(this.createStep(this.config.authorization.data.domain, "domain\\username"));
        stepper.addStep(this.createStep(this.config.authorization.data.password, "password", true));

        const [domain, password] = await stepper.run<string>();
        if (!domain || !password) {
            throw new Error("could not resolve credentials");
        }
        return { domain, password };
    }

    /**
     * create a step
     *
     */
    private createStep(value: string | undefined, placeholder = '', isPassword = false): IStep {
        if (!value || value.trim() === '') {
            return new InputStep(placeholder, isPassword);
        }
        return new ResolvedStep(value);
    }

    /**
     * submit form data and returns a redirect uri
     */
    private async submitForm(uri: string, username: string, password: string, rejectUnauthorized = true): Promise<string>
    {
        const body = `username=${encodeURIComponent(username)}&pwd=${encodeURIComponent(password)}`;
        const headers = {
            "Content-length": body.length,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        return new Promise((resolve, reject) => {
            const options = { body, headers, method: "POST", uri, rejectUnauthorized };
            request(options, (error, response: Response) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (response.statusCode !== 302) {
                    reject(response.statusMessage);
                    return;
                }
                resolve(response.headers.location ?? "");
            });
        });
    }

    /**
     * finalize login process, since we know now the redirect uri which is called
     * after login is working
     */
    private finalizeLoginProcess(uri: string, rejectUnauthorized = true): Promise<any[]>
    {
        const ws = new WebSocket(uri, {rejectUnauthorized});
        let result;

        return new Promise((resolve, reject) => {
            ws.once("close", () => result ? resolve(result) : reject("no session cookie was found"));
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
