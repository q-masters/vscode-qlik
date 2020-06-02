import { injectable } from "tsyringe";

@injectable()
export class QixVariableProvider {

    public async read() {
        /*
        const connection = await this.getConnection(workspaceUri);
        const session    = await connection.open(id);
        return session?.openDoc(id);
        const app        = await this.openApp(uri, this.extractAppId(params.app));
        const varName    = this.sanitizeName(params.variable);
        const variable   = await this.getVariable(app, varName);

        if (variable) {
            const properties = await variable.getProperties();
            return Buffer.from(YAML.stringify({
                qDefinition: properties?.qDefinition ?? "",
                qComment: properties?.qComment ?? "",
                qNumberPresentation: properties?.qNumberPresentation,
                qIncludeInBookmark: properties?.qIncludeInBookmark ?? false
            }, {
                indent: 4
            }));
        }
        return Buffer.from("Error");
        */
    }
}
