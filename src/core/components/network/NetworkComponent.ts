import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkComponent } from "./interface";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { Controller } from "./mvc/Controller";

/**
 * Network component
 * Manages HTTP and WebSocket connections through child connector components
 */
class NetworkComponent extends StreamSubscribeComponent implements INetworkComponent {
    
    protected classes = {
        Controller: Controller,
        Model: Model,
        View: View
    };
}

export { NetworkComponent };
