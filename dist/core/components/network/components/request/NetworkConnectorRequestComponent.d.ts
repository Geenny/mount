import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkConnectorRequestComponent } from "./interface";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
/**
 * Network connector request component
 * Handles HTTP/HTTPS requests using fetch API
 */
export declare class NetworkConnectorRequestComponent extends StreamSubscribeComponent implements INetworkConnectorRequestComponent {
    serverConfig: any;
    protected classes: {
        Controller: typeof Controller;
        Model: typeof Model;
        View: typeof View;
    };
}
