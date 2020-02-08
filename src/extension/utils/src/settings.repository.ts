import * as vscode from "vscode";
import ObjectHash from "object-hash";

export interface Setting {
    uid: string;
    [key: string]: any;
}

/**
 * Settings Repository
 */
export class SettingsRepository<T extends Setting> {

    private data: T[];

    private isArrayStorage = true;

    public constructor(
        private section: string
    ) {
        this.loadData();
    }

    /**
     * create new setting, automatically adds an id
     */
    public async create(data: T): Promise<T> {
        const override = !!this.isArrayStorage;
        const setting  = this.addId(data);

        !override
            ? this.data = [setting]
            : this.data.push(setting);

        await this.writeSettings();
        return setting;
    }

    /**
     * return all data we have allready loaded
     */
    public read(): T[] {
        return Array.from(this.data);
    }

    /**
     * update setting in storage
     */
    public async update(source: T): Promise<T> {
        const updated: T = this.addId(source);
        this.data = this.data.map<T>((setting: T) => setting.uid === source.uid ? updated: setting);
        await this.writeSettings();
        return updated;
    }

    /**
     * remove an element from settings
     */
    public async destroy(setting: T): Promise<void> {
        this.data = this.data.filter((current) => setting.uid !== current.uid);
        await this.writeSettings();
    }

    /**
     * reloads all data
     */
    public reload() {
        this.loadData();
    }

    /**
     * load settings from vscode
     */
    private loadData() {
        const configuration = vscode.workspace.getConfiguration();
        const data = configuration.get(`vsQlik.${this.section}`);

        if (data) {
            const settings = !Array.isArray(data) ? (this.isArrayStorage = false, [data]) : data;
            this.data = settings.map((setting: T) => this.addId(setting));
        } else {
            throw new Error(`Could not find Settings for ${this.section}`);
        }
    }

    /**
     * write settings to vscode
     */
    private async writeSettings(): Promise<void> {
        const configuration = vscode.workspace.getConfiguration();
        const data =  this.data.map((setting) => this.cleanUpSetting(setting));
        await configuration.update(`vsQlik.${this.section}`, this.isArrayStorage ? data : data[0], true);
    }

    /**
     * adds an id to current settings object
     */
    private addId(setting: T): T {
        return {...setting, ...{uid: ObjectHash(setting)}};
    }

    /**
     * removes settings id before we write
     */
    private cleanUpSetting(setting: T): T {
        const cloned = {...setting};
        delete cloned.uid;
        return cloned;
    }
}
