import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkComponent } from "./interface";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { Controller } from "./mvc/Controller";
/**
 * Network component
 * Manages HTTP and WebSocket connections through child connector components
 */
declare class NetworkComponent extends StreamSubscribeComponent implements INetworkComponent {
    protected classes: {
        Controller: typeof Controller;
        Model: typeof Model;
        View: typeof View;
    };
}
export { NetworkComponent };
