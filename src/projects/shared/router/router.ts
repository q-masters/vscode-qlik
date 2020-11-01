import { singleton, container } from "tsyringe";

export interface Route<T extends any> {
    path: string;
    ctrl: ClassConstructor<T>;
    children?: Route<T>[];
    canActivate?: Array<() => Promise<boolean>>;
}

export interface ResolvedRoute<T> {
    control: T,
    params: RouteParam,
}

export interface RouteParam {
    [param: string] : string;
}

interface RouteData<T> {
    matcher: RegExp;
    params: string[];
    control: ControllerFactory<T>;
    route: string;
}

interface ControllerFactory<T> {
    getControl(): T;
}

export interface ClassConstructor<T> {
    new(...args): T;
}

/**
 * helper to resolve controller dependencies
 */
function resolveControllerDependencies (target, key, descriptor) {
    if(descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, key);
    }

    const originalMethod = descriptor.value;

    //editing the descriptor/value parameter
    descriptor.value = function (...args) {
        const params: any[] = Reflect.getMetadata("design:paramtypes", args[0]) || [];
        const injections = params.map((dep) => container.resolve(dep));
        return originalMethod.apply(this, [...args, ...injections]);
    };

    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
}

/**
 * factory to create a concrete adapter
 * like a qlik script file adapter or documents directory adapter
 *
 * works as flyweight, routes allways return same instance from a adapter
 */
@singleton()
export class QixRouter<T> {

    private routes: Map<string, RouteData<T>> = new Map();

    private controls: WeakMap<any, ControllerFactory<T>> = new WeakMap();

    /**
     * find endpoint by given uri
     */
    public find(path: string): ResolvedRoute<T> | undefined {

        const routes = this.routes.values();
        let route: RouteData<T>;
        let matches: RegExpMatchArray | null = null;

        /** loop all routes until all routes are used or we have a matched route */
        while((route = routes.next().value) && !(matches = path.match(route.matcher)));

        if (route) {
            /** merge param name and value together into one object */
            const params = route.params.reduce<RouteParam>(
                (params, routeParam, index) => (params[routeParam] = matches?.[index +1] || "", params)
                ,{}
            );

            return {
                control: route.control.getControl(),
                params
            };
        }
    }

    /**
     * add new route
     */
    public addRoutes(routes: Route<T>[]): void {
        routes.forEach((route) => this.registerRoute(route));
    }

    /**
     * register route to router
     *
     * @todo check correct behavior route allready registered (maybe show warning)
     */
    private registerRoute(route: Route<T>) {
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
    private parseRoute(route: string): any {

        /**
         * extract all params and remove trainling :
         */
        let params = route.match(/:([^/]+)/g) || [];
        params = params.map((param) => param.substr(1));

        /**
         * create match pattern for given route
         *
         * so we know RegExp.$1 = appId
         * so we know RegExp.$2 = varName
         *
         * /:appId/vars/:varName becomes ([^/]+)/script/([^/]+)
         */
        const routePattern = route.replace(/:([^/]+)/g, "([^/]+)");

        /**
         * build matcher for real route which will given
         * like /1234-5678-9012-3456/script/border-color
         *
         * after route pattern has been called params will be
         * all that matches will maped to params in order
         *     appId   = 1234-5678-9012-3456
         *     varName = border-color
         */
        const matcher = new RegExp('^/' + routePattern + '$');

        return { matcher, params, route };
    }

    /**
     * controller factory for lazy initialization,
     * also ensures one adapter exists only 1 time.
     */
    @resolveControllerDependencies
    private createControllerFactory(ctrl: ClassConstructor<T>, ...dependencies): ControllerFactory<T> {
        let instance;
        return {
            getControl: (): T => {
                if (!instance) {
                    instance = new ctrl(...dependencies);
                }
                return instance;
            }
        };
    }
}
