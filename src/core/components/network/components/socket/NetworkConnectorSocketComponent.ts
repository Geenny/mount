import { NetworkConnectorComponent } from "../connector/NetworkConnectorComponent";
import { NetworkConnectorSocketController } from "./mvc/NetworkConnectorSocketController";
import { NetworkConnectorSocketModel } from "./mvc/NetworkConnectorSocketModel";

/**
 * Network connector socket component
 * Handles WebSocket connections
 */
export class NetworkConnectorSocketComponent extends NetworkConnectorComponent {

    protected classes = {
        Controller: NetworkConnectorSocketController,
        Model: NetworkConnectorSocketModel
    };

}
