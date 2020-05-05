import * as vscode from "vscode";
import { QixFsEntry, QixFsEntryConstructor } from "../../entry";

export interface Route {
    path: string;
    ctrl: QixFsEntryConstructor,
    /** @todo implement children ... maybe */
    children?: Route[]
};

export interface QixFsRoute {
    entry: QixFsEntry,
    params: RouteParam,
}

export interface RouteParam {
    [param: string] : string;
}

interface RouteData {
    matcher: RegExp;
    params: string[];
    control: ControllerFactory;
    route: string;
};

interface ControllerFactory {
    getControl(): QixFsEntry;
}

/**
 * factory to create a concrete adapter 
 * like a qlik script file adapter or documents directory adapter
 * 
 * works as flyweight, routes allways return allways same instance from a adapter
 */
export class QixRouter {

    private static routes: Map<string, RouteData> = new Map();

    private static controls: WeakMap<any, ControllerFactory> = new WeakMap();

    /**
     * find endpoint by given uri
     */
    public static find(uri: vscode.Uri): QixFsRoute | undefined {
        if (uri.scheme !== "qix") {
            return;
        }

        const routes = this.routes.values();
        let route: RouteData;
        let matches: RegExpMatchArray | null = null;

        /** loop all routes until all routes are used or we have a matched route */
        while((route = routes.next().value) && !(matches = uri.path.match(route.matcher)));

        if (route) {
            /** merge param name and value together into one object */
            const params = route.params.reduce<RouteParam>(
                (params, routeParam, index) => (params[routeParam] = matches?.[index +1] || "", params)
                ,{}
            );

            return {
                entry: route.control.getControl(),
                params
            }
        }
    }

    /**
     * add new route
     */
    public static addRoutes(routes: Route[]) {
        routes.forEach((route) => this.registerRoute(route));
    }

    /**
     * register route to router
     * 
     * @todo check correct behavior route allready registered (maybe show warning)
     */
    private static registerRoute(route: Route) {

        if (!this.controls.has(route.ctrl)) {
            this.controls.set(route.ctrl, this.createControllerFactory(route.ctrl));
        }

        const parsed  = this.parseRoute(route.path);
        const control = this.controls.get(route.ctrl);

        /** save route */
        this.routes.set(route.path, { ...parsed, control});
    }

    /**
     * parse route data
     */
    private static parseRoute(route: string): any {
        let params  = route.match(/:([^\/]+)/g) || [];
        let matcher = new RegExp('^/' + route.replace(/:([^\/]+)/g, "([^/]+)") + '$');

        return {
            matcher,
            params : params.map((segment) => segment.substr(1)),
            route: route
        };
    }

    /**
     * controller factory for lazy initialization,
     * also ensures one adapter exists only 1 time.
     */
    private static createControllerFactory(ctrl: QixFsEntryConstructor): ControllerFactory {
        let instance;
        return {
            getControl: (): QixFsEntry => {
                if (!instance) {
                    instance = new ctrl();
                }
                return instance;
            }
        }
    }
}
