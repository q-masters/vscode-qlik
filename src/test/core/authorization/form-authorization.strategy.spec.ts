import { FormAuthorizationStrategy } from "@core/authorization/strategies/form-authorization.strategy";
import { expect } from "chai";
import { ConnectionSetting } from "@core/connection";

describe('Test Form Authorization Strategy', () => {

    const connectionSettings: ConnectionSetting = {
        cookies: [],
        allowUntrusted: true,
        secure: true,
        path: "",
        host: "my.qlik.server"
    };

    it('authorization should file (server not working)', async () => {
        const strategy = new FormAuthorizationStrategy(connectionSettings);
        const result   = await strategy.run(`vsqlik\\test`, 'test');

        expect(result).to.deep.equal({
            success: false,
            cookies: [],
            error: "ENOTFOUND: my.qlik.server"
        });
    });
});
