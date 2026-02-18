import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkConnectorSocketComponent } from "./interface";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
/**
 * Network connector socket component
 * Handles WebSocket connections
 */
export declare class NetworkConnectorSocketComponent extends StreamSubscribeComponent implements INetworkConnectorSocketComponent {
    serverConfig: any;
    protected classes: {
        Controller: typeof Controller;
        Model: typeof Model;
        View: typeof View;
    };
}
