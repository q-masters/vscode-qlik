import { Step } from "./api";

export class ResolvedStep extends Step<string> {

    public constructor(
        private value: string
    ) {
        super();
    }

    execute(): Promise<string> {
        return Promise.resolve(this.value);
    }
}
