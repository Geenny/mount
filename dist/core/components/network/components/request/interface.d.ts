import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { NetworkRequestType, NetworkResponseType, NetworkServerConfig } from "../../types";
import { NetworkConnectionStatus } from "../../enums";
/**
 * Network connector request component interface
 */
interface INetworkConnectorRequestComponent extends IComponent {
    serverConfig: NetworkServerConfig;
}
/**
 * Network connector request model interface
 */
interface INetworkConnectorRequestModel extends IModel {
    status: NetworkConnectionStatus;
    abortControllers: Map<string, AbortController>;
}
/**
 * Network connector request controller interface
 */
interface INetworkConnectorRequestController extends IController {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(request: NetworkRequestType): Promise<NetworkResponseType>;
    getStatus(): NetworkConnectionStatus;
    isConnected(): boolean;
}
/**
 * Network connector request view interface
 */
interface INetworkConnectorRequestView extends IView {
}
export type { INetworkConnectorRequestComponent, INetworkConnectorRequestModel, INetworkConnectorRequestController, INetworkConnectorRequestView };
