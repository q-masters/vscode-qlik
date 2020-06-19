import { injectable } from "tsyringe";
import { EnigmaSession } from "@shared/connection";
import { variableDef, IVariableListItem } from "../api";

@injectable()
export class QixVariableProvider {

    /**
     *  get all variables from an existing app
     */
    public async list(connection: EnigmaSession, app_id: string) {
        const session = await connection.open(app_id);
        const app     = await session?.openDoc(app_id);

        if (app) {
            const listObject   = await app.createSessionObject(variableDef);
            const layout       = await listObject.getLayout() as any;
            app.destroySessionObject(listObject.id);
            return layout.qVariableList.qItems as IVariableListItem[];
        }
        return [];
    }

    public async readVariable(connection, app_id: string, name: string): Promise<EngineAPI.IGenericVariable | undefined> {
        const session = await connection.open(app_id);
        const app     = await session?.openDoc(app_id);

        return await app?.getVariableByName(name);
    }

    /**
     * create a new variable
     */
    public async createVariable(connection: EnigmaSession, app_id: string, properties: EngineAPI.IGenericVariableProperties): Promise<void>
    {
        const session = await connection.open(app_id);
        const app     = await session?.openDoc(app_id);

        await app?.createVariableEx(properties);
        await app?.doSave();
    }

    /**
     * update an existing variable
     */
    public async updateVariable(connection: EnigmaSession, app_id: string, name: string, patch: EngineAPI.IGenericVariableProperties): Promise<void>
    {
        const session  = await connection.open(app_id);
        const app      = await session?.openDoc(app_id);
        const variable = await app?.getVariableByName(name);
        const patches = Object.keys(patch).map<EngineAPI.INxPatch>((property) => {
            return {
                qOp   : "Replace",
                qPath : `/${property}`,
                qValue: `${JSON.stringify(patch[property], null, 4)}`
            };
        });
        await variable?.applyPatches(patches);
        await app?.doSave();
    }

    public deleteVariable() {
    }
}
