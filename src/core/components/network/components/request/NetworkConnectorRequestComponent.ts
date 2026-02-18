import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkConnectorRequestComponent } from "./interface";
import { NetworkConnectorRequestController } from "./mvc/Controller";
import { NetworkConnectorRequestModel } from "./mvc/Model";
import { NetworkConnectorRequestView } from "./mvc/View";

/**
 * Network connector request component
 * Handles HTTP/HTTPS requests using fetch API
 */
export class NetworkConnectorRequestComponent extends StreamSubscribeComponent implements INetworkConnectorRequestComponent {
    
    public serverConfig: any;
    
    protected classes = {
        Controller: NetworkConnectorRequestController,
        Model: NetworkConnectorRequestModel,
        View: NetworkConnectorRequestView
    };
}
