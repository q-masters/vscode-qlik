import { IStep } from "./api";

export class Stepper {

    private steps: IStep[] = [];

    public constructor(
        private title: string
    ) { }

    public addStep(step: IStep) {
        this.steps.push(step);
    }

    public async run<R extends unknown>(): Promise<(R | undefined)[]> {

        const steps: IStep[] = [...this.steps];
        const result: (R | undefined)[] = [];

        let step = steps.shift();

        while (step) {

            step.title = this.title;

            try {
                const stepResult = await step.execute();
                result.push(stepResult as R);
            } catch (error) {
                result.push(void 0);
            }

            step.destroy();
            step = steps.shift();
        }

        return result;
    }
}
