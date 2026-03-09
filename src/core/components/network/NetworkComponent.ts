import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { IComponentConnector, INetworkComponent, INetworkConnector } from "./interface";
import { Model } from "./mvc/NetworkModel";
import { Controller } from "./mvc/NetworkController";
import { NetworkRequestType } from "./types";

/**
 * Network component
 * Manages HTTP and WebSocket connections through child connector components
 */
export class NetworkComponent extends StreamSubscribeComponent implements INetworkComponent {
    
    protected classes = {
        Controller: Controller,
        Model: Model
    };

    protected childrenList: IComponentConnector[] = [];

    connectorGet( request: NetworkRequestType ): INetworkConnector | undefined {
        const serverID = request.params?.serverID;

        const connector = serverID
            ? this.childrenList.find( child => child.serverID === serverID )
            : this.childrenList.find( child => child.isDefault );

        return connector as INetworkConnector | undefined;
    }

}
