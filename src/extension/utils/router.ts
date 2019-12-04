import * as vscode from "vscode";

interface RouteSegment {
    isParam: boolean;
    name: string;
}

export interface ActivatedRoute {
    path: string;
    action: string | number;
    params: {[key: string]: string}
}

export interface RouteData {
    path: string;
    action: string | number;
    segments: RouteSegment[]
}

export interface Route {
    path: string;
    action: string;
}

export class Router {

    private static instance: Router = new Router();

    private routes: Map<string, RouteData>;
   
    public static getInstance(): Router {
        return this.instance;
    }

    private constructor() {
        if (Router.instance) {
            throw new Error("use Router.getInstance");
        }
        this.routes = new Map();
    }

    public addRoutes(routes: Route[]) {
        routes.forEach((route) => {
            if (this.routes.has(route.path)) {
                return;
            }
            this.routes.set(route.path, this.parseRoute(route));
        });
    }

    /**
     * parse uri and return activated route if exists
     */
    public parse(uri: vscode.Uri): ActivatedRoute | undefined {

        const pathSegments = uri.path.split("/").filter((segment) => segment !== "");

        /** find route if we dont get an excact match we have to search for it */
        const route = this.routes.has(uri.path)
            ? this.routes.get(uri.path)
            : this.findRoute(pathSegments);

        const params = route?.segments.reduce((params, segment, index) => {
            segment.isParam ? params[segment.name] = pathSegments[index] : void 0;
            return params;
        }, {});

        if (route) {
            return {
                action: route.action,
                params: params || {},
                path: route.path
            }
        }
    }

    /**
     * convert given route into RouteData
     */
    private parseRoute(route: Route): RouteData {
        const path     = route.path;
        const parts    = path.split("/").filter((segment) => segment !== "");
        const segments = parts.map((part) => {
            const isParam = part.indexOf(":") === 0;
            const name    = isParam ? part.substr(1) : part;
            return { isParam, name };
        });
        return {...route, segments };
    }

    /**
     * find route by given uri.path segments
     */
    private findRoute(segments: string[]): RouteData | undefined {
        let needle: RouteData | undefined;

        for(const route of this.routes.values()) {
            if (segments.length !== route.segments.length) {
                continue;
            }

            const isMatch = route.segments.every((segment, index) => 
                !segment.isParam ? segment.name === segments[index] : true);

            if (isMatch) {
                needle = route;
                break;
            }
        }

        return needle;
    }
}
