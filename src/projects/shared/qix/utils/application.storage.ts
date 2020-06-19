import { injectable } from "tsyringe";

@injectable()
export class ApplicationStorage {

    /**
     * all applications we currently have
     */
    private applications: Set<EngineAPI.IDocListEntry> = new Set();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public exists(app: string): boolean {
        throw new Error("not implemented yet");
    }

    public addApplication(entry: EngineAPI.IDocListEntry) {
        this.applications.add(entry);
    }

    public deleteApplication() {
    }

    public updateApplication() {
    }
}
