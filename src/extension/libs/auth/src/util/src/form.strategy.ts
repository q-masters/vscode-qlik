import { request, Response } from "request";

/**
 * login to qlik with form strategy
 */
export class AuthFormStrategy {

    public constructor(private uri: string) {
    }

    public async authorize(
        username: string,
        password: string
    ) {
        const formUri = await this.getFormUri();
        const redirectUri = await this.submitForm(formUri, username, password);
        const sessionCookie = await this.getSessionCookie(redirectUri);

        return sessionCookie;
    }

    /**
     * initialize form by calling the uri
     * which resolves the uri we have to send our post request
     * with login credentials
     */
    private getFormUri(): Promise<string> {

        const options = {
            uri: this.uri,
            method: "GET"
        };

        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (!error) {
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
    private getSessionCookie(uri: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const options = { method: "GET", uri };
            request(options, (error, response: Response) => {
                if (error) {
                    reject(error);
                    return;
                }

                const cookies: string[] = response.headers['set-cookie'];
                const sessionCookie = cookies.find((cookie) => cookie.match(/^X-Qlik-Session-/));

                if (!sessionCookie) {
                    reject("no session cookie found");
                    return;
                }

                // 'X-Qlik-Session-HTTP=45d810fd-3464-4ca7-8c5b-db4fb788b1c9; Path=/; HttpOnly'
                const cookieData = sessionCookie.split(";")[0].split("=")
                const [name, key] = cookieData;
                resolve({ name, key });
            });
        });
    }
}
