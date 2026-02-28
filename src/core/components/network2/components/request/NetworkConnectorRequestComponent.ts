import { NetworkConnectorComponent } from "../connector/NetworkConnectorComponent";
import { NetworkConnectorRequestController } from "./mvc/NetworkConnectorRequestController";
import { NetworkConnectorRequestModel } from "./mvc/NetworkConnectorRequestModel";

/**
 * Network connector request component
 * Handles HTTP/HTTPS requests using fetch API
 */
export class NetworkConnectorRequestComponent extends NetworkConnectorComponent {
    
    protected classes = {
        Controller: NetworkConnectorRequestController,
        Model: NetworkConnectorRequestModel
    };

    protected async onStart(): Promise<void> {
        await super.onStart();
        // this.controller
    }

}
