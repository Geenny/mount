import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkComponent } from "./interface";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { Controller } from "./mvc/Controller";

/**
 * Network component
 * Manages HTTP and WebSocket connections, request queues, caching, and retry logic
 */
class NetworkComponent extends StreamSubscribeComponent implements INetworkComponent {
    
    protected classes: any = {
        Controller: Controller,
        Model: Model,
        View: View
    };
    
    protected createModel(): void {
        this.model = new Model( this as any, this.controller as any, this.view as any );
    }
    
    protected createView(): void {
        this.view = new View( this as any, this.controller as any, this.model as any );
    }
    
    protected createController(): void {
        if ( !this.model ) throw new Error( 'Model is not created' );
        if ( !this.view ) throw new Error( 'View is not created' );
        this.controller = new Controller( this as any, this.model as any, this.view as any );
    }
}

export { NetworkComponent };
