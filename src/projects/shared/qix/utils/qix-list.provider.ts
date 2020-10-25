import { Observable, from, EmptyError } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import deepmerge from "deepmerge";
import { Connection } from "projects/extension/connection/utils/connection";

export interface DataNode {
    [key: string]: any;
}

export abstract class QixListProvider {


    public abstract createProperties(name: string): DataNode;

    /**
     * list properties to create a sessionObject
     */
    protected listProperties: EngineAPI.IGenericProperties;

    /**
     * extract items from sessionObject.getLayout() response
     */
    protected abstract extractListItems<T>(layout: EngineAPI.IGenericBaseLayout): T[];

    /**
     * get object to call get- setProperties
     *
     * wrong typings again ...
     */
    protected abstract getObject(app: EngineAPI.IApp, id: string): Promise<DataNode>;

    /**
     * create new object (measure, dimension, ...)
     */
    protected abstract createObject(app: EngineAPI.IApp, properties: EngineAPI.IGenericProperties): Promise<EngineAPI.IGenericObject>;

    /**
     * an existing object should be deleted
     */
    protected abstract delete(app: EngineAPI.IApp, object: string): Promise<boolean>;

    /**
     * resolve all measure items
     */
    public list<T>(connection: Connection, app: string): Observable<T[]> {
        return from(connection.openDoc(app)).pipe(
            switchMap((app) => app?.createSessionObject(this.listProperties) ?? EmptyError),
            switchMap((obj) => obj.getLayout()),
            map((layout) => this.extractListItems<T>(layout)),
            catchError((error) => {
                throw error;
            })
        );
    }

    public async create<T extends EngineAPI.IGenericObject>(connection: Connection, app_id: string, properties: EngineAPI.IGenericProperties): Promise<T> {
        const app = await connection?.openDoc(app_id);
        if (app) {
            return await this.createObject(app, properties) as T;
        }

        throw new Error(`Could not open app.`);
    }

    /**
     * get properties from sessionObject item
     */
    public async read(connection: Connection, app: string, object_id: string): Promise<DataNode> {
        const genericObject = await this.resolveGenericObject(connection, app, object_id);
        return await genericObject.getProperties();
    }

    /**
     * write data to sessionObject item via set properties
     */
    public async update(connection: Connection, app: string, object_id: string, data: DataNode): Promise<void> {
        const genericObject = await this.resolveGenericObject(connection, app, object_id);
        return await genericObject.setProperties(data);
    }

    /**
     * rename measure
     */
    public async rename(connection: Connection, appId: string, objectId: string, newName: string): Promise<any> {
        const patch   = {
            qMetaDef: {
                title: newName
            }
        };
        return await this.patch(connection, appId, objectId, patch);
    }

    /**
     * patch data
     */
    public async patch(connection: Connection, app: string, object: string, patch: DataNode): Promise<any> {
        const genericObject = await this.resolveGenericObject(connection, app, object);
        const oldData       = await genericObject.getProperties();
        const newData       = deepmerge.all([oldData, patch]);

        await genericObject.setProperties(newData);
        return await genericObject.getLayout();
    }

    /**
     * destroy a session object
     */
    public async destroy(connection: Connection, app_id: string, object: string): Promise<void> {
        const app    = await connection?.openDoc(app_id);
        if (app) {
            this.delete(app, object);
        }
    }

    /**
     * resolve generic object which we are interested for
     */
    private async resolveGenericObject(connection: Connection, app_id: string, object_id: string): Promise<any> {
        const app    = await connection?.openDoc(app_id);

        if (app) {
            return this.getObject(app, object_id);
        }
    }
}
