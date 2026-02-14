import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { Storage } from "utils/storage/Storage";
import { NetworkConnectorComponent } from "./components/connector/NetworkConnectorComponent";
import { NetworkConnectionRequest, NetworkServerConfig, NetworkStatsType } from "./types";

/**
 * Network component interface
 */
interface INetworkComponent extends IComponent {
    
}

/**
 * Network model interface
 */
interface INetworkModel extends IModel {
    // Connectors map (serverId -> connector)
    connectors: Map< string, NetworkConnectorComponent >;
    
    // Request queues (serverId -> queue)
    requestQueues: Map< string, NetworkConnectionRequest[] >;
    
    // Active requests (requestId -> request)
    activeRequests: Map< string, NetworkConnectionRequest >;
    
    // Caches (serverId -> storage)
    caches: Map< string, Storage >;
    
    // Statistics
    stats: NetworkStatsType;
    
    // Helper methods
    getConnector( serverId: string ): NetworkConnectorComponent | undefined;
    getQueue( serverId: string ): NetworkConnectionRequest[];
    getCache( serverId: string ): Storage | undefined;
    updateStats(): void;
}

/**
 * Network controller interface
 */
interface INetworkController extends IController {
    
}

/**
 * Network view interface
 */
interface INetworkView extends IView {
    
}

export type {
    INetworkComponent,
    INetworkModel,
    INetworkController,
    INetworkView
};
