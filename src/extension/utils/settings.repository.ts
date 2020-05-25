import * as vscode from "vscode";

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
        const setting  = {...data, uid: this.generateId()};

        !override
            ? this.data = [setting]
            : this.data.push(setting);

        await this.writeSettings();
        return setting;
    }

    /**
     * returns true if settings exists
     */
    public exists(id: string): boolean {
        return this.data.some((setting) => setting.uid === id);
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
    public async update(source: T): Promise<void> {
        this.data = this.data.map<T>((setting: T) => setting.uid === source.uid ? source : setting);
        await this.writeSettings();
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
     * generates an id which is used to identify this setting
     * again
     */
    public generateId(): string {
        const chars = [
            97, 122,  // a-z
            65,  90,  // A-Z
            48,  57
        ]; // 0-9

        let key = '';

        for (let i = 0, ln = 16; i < ln; i++) {
            /** get starting index for chars 0, 2 or 4*/
            const startIndex = Math.floor(Math.random() * 3) * 2;
            /** slice range from startIndex + 2 Elements and get char code range */
            const range = chars.slice(startIndex, startIndex + 2);
            /** get delta from ascii code range */
            const delta = range[1] - range[0];
            /** create dezimal charCode */
            const charCode = Math.round(Math.random() * delta) + range[0];

            /** generate char code and append to current key */
            key += String.fromCharCode(charCode);

            if (i % 4 === 0 && i > 0) {
                key += "-";
            }
        }

        return key;
    }

    /**
     * load settings from vscode
     */
    private loadData() {
        const configuration = vscode.workspace.getConfiguration();
        const data = configuration.get(`vsQlik.${this.section}`);

        if (data) {
            const settings = !Array.isArray(data) ? (this.isArrayStorage = false, [data]) : data;
            /** write an id to current setting, has to be removed before save */
            this.data = settings.map((setting: T) => ({ ...setting, uid: this.generateId()}));
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
        return setting;
    }

    /**
     * removes settings uid before we write
     */
    private cleanUpSetting(setting: T): T {
        const cloned = {...setting};
        delete cloned.uid;
        return cloned;
    }
}
