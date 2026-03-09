import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { NetworkConnectionRequest, NetworkRequestStatsType, NetworkRequestType } from "./types";

/**
 * Network component interface
 */
interface INetworkComponent extends IComponent {

    connectorGet( request: NetworkRequestType ): INetworkConnector | undefined;
    
}

/**
 * Network model interface
 */
interface INetworkModel extends IModel {

    // // Request queues (serverId -> queue)
    // requestQueues: Map< string, NetworkConnectionRequest[] >;
    
    // // Active requests (requestId -> request)
    // activeRequests: Map< string, NetworkConnectionRequest >;
    
    // // Caches (serverId -> storage)
    // caches: Map< string, Storage >;
    
    // // Statistics
    // stats: NetworkRequestStatsType;

}

/**
 * Network controller interface
 */
interface INetworkController extends IController {
    
}

interface INetworkConnector {

    readonly isDefault: boolean;

    readonly serverID: string;

    readonly isConnected: boolean;

}

interface IComponentConnector extends IComponent {
    serverID: string;
    isDefault?: boolean;
};

export type {
    IComponentConnector,
    INetworkComponent,
    INetworkModel,
    INetworkController,
    INetworkConnector
};
