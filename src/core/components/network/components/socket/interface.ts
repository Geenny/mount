import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { NetworkRequestType, NetworkResponseType, NetworkServerConfig } from "../../types";
import { NetworkConnectionStatus } from "../../enums";

/**
 * Network connector socket component interface
 */
interface INetworkConnectorSocketComponent extends IComponent {
    serverConfig: NetworkServerConfig;
}

/**
 * Network connector socket model interface
 */
interface INetworkConnectorSocketModel extends IModel {
    status: NetworkConnectionStatus;
    socket: WebSocket | null;
    messageQueue: NetworkRequestType[];
    pendingRequests: Map< string, any >;
}

/**
 * Network connector socket controller interface
 */
interface INetworkConnectorSocketController extends IController {
    connect(): Promise< void >;
    disconnect(): Promise< void >;
    send( request: NetworkRequestType ): Promise< NetworkResponseType >;
    getStatus(): NetworkConnectionStatus;
    isConnected(): boolean;
}

/**
 * Network connector socket view interface
 */
interface INetworkConnectorSocketView extends IView {
    
}

export type {
    INetworkConnectorSocketComponent,
    INetworkConnectorSocketModel,
    INetworkConnectorSocketController,
    INetworkConnectorSocketView
};
