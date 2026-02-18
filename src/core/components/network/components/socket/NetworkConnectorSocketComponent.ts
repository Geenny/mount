import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkConnectorSocketComponent } from "./interface";
import { NetworkConnectorSocketController } from "./mvc/Controller";
import { NetworkConnectorSocketModel } from "./mvc/Model";
import { NetworkConnectorSocketView } from "./mvc/View";

/**
 * Network connector socket component
 * Handles WebSocket connections
 */
export class NetworkConnectorSocketComponent extends StreamSubscribeComponent implements INetworkConnectorSocketComponent {
    
    public serverConfig: any;
    
    protected classes = {
        Controller: NetworkConnectorSocketController,
        Model: NetworkConnectorSocketModel,
        View: NetworkConnectorSocketView
    };
}
