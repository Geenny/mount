import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkConnectorRequestComponent } from "./interface";
import { Controller } from "./mvc/NetworkConnectorRequestController";
import { Model } from "./mvc/NetworkConnectorRequestModel";

/**
 * Network connector request component
 * Handles HTTP/HTTPS requests using fetch API
 */
export class NetworkConnectorRequestComponent extends StreamSubscribeComponent implements INetworkConnectorRequestComponent {
    
    public serverConfig: any;
    
    protected classes = {
        Controller: Controller,
        Model: Model
    };
}
