import FormAuthorizationStrategy from "projects/shared/authorization/strategies/form-authorization.strategy";
import { Stepper, InputStep, ResolvedStep, IStep } from "projects/extension/stepper";
import { AuthorizationSetting, FormAuthorizationData } from "projects/shared/authorization/api";

export class VsQlikFormAuthorizationStrategy extends FormAuthorizationStrategy {

    /**
     * resolve login credentials via input steps in visual studio code
     */
    protected async resolveCredentials(
        settings: AuthorizationSetting<FormAuthorizationData>
    ): Promise<{ domain: string; password: string; }> {
        const stepper  = new Stepper("Login");
        stepper.addStep(this.createStep(settings.data.domain, "domain\\username"));
        stepper.addStep(this.createStep(settings.data.password, "password", true));

        const [domain, password] = await stepper.run<string>();

        if (!domain || !password) {
            throw new Error("could not resolve credentials");
        }

        return { domain, password };
    }

    /**
     * create a step
     */
    private createStep(value: string | undefined, placeholder = "", password = false): IStep {
        if (!value || value.trim() === "") {
            return new InputStep(placeholder, this.connection.host, password);
        }
        return new ResolvedStep(value);
    }
}

export default VsQlikFormAuthorizationStrategy;
