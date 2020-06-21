import { ComponentPortal } from "@angular/cdk/portal";
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector } from "@angular/core";
import { ActiveTabInterface, TabConfig, TabComponent } from "../api/tabs";

/**
 * A PortalOutlet that lets multiple components live for the lifetime of the outlet,
 * allowing faster switching and persistent data.
 */
export class TabPortalOutlet {

    // Active tabs that have been instantiated
    private _activeTabs: { [name: string]: ActiveTabInterface } = {};

    // The current tab
    private _currentTab: ActiveTabInterface | null = null;

    constructor(
        public availableTabs: TabConfig[],
        public outletElement: Element,
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) { }

    /**
     * Returns the current active TabComponent instances.
     */
    public get activeComponents(): TabComponent[] {
        return Object
        .keys(this._activeTabs)
        .map((name: string) => this._activeTabs[name].componentRef.instance);
    }

    public get currentTab(): Readonly<ActiveTabInterface> {
        return this._currentTab;
    }

    public switchTo(name: string) {
        const tab = this.availableTabs.find(item => item.name === name);

        if (!tab) {
            return;
        }

        // Detach any current instance
        this.detach();

        // Get existing or new component instance
        const instance = this.activateInstance(tab);

        // At this point the component has been instantiated, so we move it to the location in the DOM where we want it to be rendered.
        this.outletElement.innerHTML = "";
        this.outletElement.appendChild(this._getComponentRootNode(instance.componentRef));
        this._currentTab = instance;
        instance.componentRef.instance.onActivate();
    }

    public detach(): void {
        const current = this._currentTab;

        if (current !== null) {
            current.portal.setAttachedHost(null);
            this._currentTab = null;
        }
    }

    /**
     * Clears out a portal from the DOM.
     */
    dispose(): void {
        // Dispose all active tabs
        for (const name in this._activeTabs) {
            if (this._activeTabs[name]) {
                this._activeTabs[name].dispose();
            }
        }

        // Remove outlet element
        if (this.outletElement.parentNode != null) {
            this.outletElement.parentNode.removeChild(this.outletElement);
        }
    }

    private activateInstance(tab: TabConfig): ActiveTabInterface {
        if (!this._activeTabs[tab.name]) {
        this._activeTabs[tab.name] = this.createComponent(tab);
        }

        return this._activeTabs[tab.name] || null;
    }

    private createComponent(tab: TabConfig): ActiveTabInterface {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(tab.componentClass);
        const componentRef = componentFactory.create(this.injector);
        const portal = new ComponentPortal(tab.componentClass, null, this.injector);

        // Attach component view
        this.appRef.attachView(componentRef.hostView);

        return {
            name: tab.name,
            portal: portal,
            componentRef: componentRef,
            dispose: () => {
                this.appRef.detachView(componentRef.hostView);
                componentRef.destroy();
            }
        };
    }

    /** Gets the root HTMLElement for an instantiated component. */
    private _getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }
}
