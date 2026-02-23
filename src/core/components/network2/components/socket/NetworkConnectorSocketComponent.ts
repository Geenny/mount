import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkConnectorSocketComponent } from "./interface";
import { Controller } from "./mvc/NetworkConnectorSocketController";
import { Model } from "./mvc/NetworkConnectorSocketModel";

/**
 * Network connector socket component
 * Handles WebSocket connections
 */
export class NetworkConnectorSocketComponent extends StreamSubscribeComponent implements INetworkConnectorSocketComponent {
    
    public serverConfig: any;
    
    protected classes = {
        Controller: Controller,
        Model: Model
    };
}
