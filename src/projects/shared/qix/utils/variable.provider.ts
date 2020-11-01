import { injectable } from "tsyringe";
import { variableDef, IVariableListItem } from "../api";
import { Connection } from "projects/extension/connection/utils/connection";

@injectable()
export class QixVariableProvider {

    /**
     *  get all variables from an existing app
     */
    public async list(connection: Connection, app_id: string): Promise<IVariableListItem[]> {

        const app = await connection?.getApplication(app_id);
        const doc = await app?.document;

        if (doc) {
            const listObject   = await doc.createSessionObject(variableDef);
            const layout       = await listObject.getLayout() as any;
            doc.destroySessionObject(listObject.id);
            return layout.qVariableList.qItems as IVariableListItem[];
        }
        return [];
    }

    public async readVariable(connection: Connection, app_id: string, var_id: string): Promise<EngineAPI.IGenericVariable | undefined> {
        const app   = await connection?.getApplication(app_id);
        const doc   = await app?.document;

        return await doc?.getVariableById(var_id);
    }

    /**
     * create a new variable
     */
    public async createVariable(
        connection: Connection,
        app_id: string,
        properties: EngineAPI.IGenericVariableProperties
    ): Promise<EngineAPI.INxInfo | undefined>
    {
        const app   = await connection?.getApplication(app_id);
        const doc   = await app?.document;
        const result = await doc?.createVariableEx(properties);

        await doc?.doSave();
        return result;
    }

    /**
     * update an existing variable
     */
    public async updateVariable(connection: Connection, app_id: string, var_id: string, patch: EngineAPI.IGenericVariableProperties): Promise<void>
    {
        const app   = await connection?.getApplication(app_id);
        const doc   = await app?.document;

        const variable = await doc?.getVariableById(var_id);
        const patches = Object.keys(patch).map<EngineAPI.INxPatch>((property) => {
            return {
                qOp   : "Replace",
                qPath : `/${property}`,
                qValue: `${JSON.stringify(patch[property], null, 4)}`
            };
        });
        await variable?.applyPatches(patches);
        await doc?.doSave();
    }

    public async deleteVariable(connection: Connection, app_id: string, var_id: string): Promise<boolean> {
        const app   = await connection?.getApplication(app_id);
        const doc   = await app?.document;

        const success  = await doc?.destroyVariableById(var_id);
        await doc?.doSave();

        return !!success;
    }
}
