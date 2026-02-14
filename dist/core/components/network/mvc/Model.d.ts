import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkComponent, INetworkController, INetworkModel, INetworkView } from "../interface";
import { NetworkConnectorComponent } from "../components/connector/NetworkConnectorComponent";
import { NetworkConnectionRequest, NetworkStatsType } from "../types";
import { Storage } from "utils/storage/Storage";
/**
 * Network component model
 */
export declare class Model extends BaseModel implements INetworkModel {
    protected component: INetworkComponent;
    protected controller: INetworkController;
    protected view: INetworkView;
    connectors: Map<string, NetworkConnectorComponent>;
    requestQueues: Map<string, NetworkConnectionRequest[]>;
    activeRequests: Map<string, NetworkConnectionRequest>;
    caches: Map<string, Storage>;
    stats: NetworkStatsType;
    constructor(component: INetworkComponent, controller: INetworkController, view: INetworkView);
    /**
     * Get connector by server ID
     */
    getConnector(serverId: string): NetworkConnectorComponent | undefined;
    /**
     * Get request queue for server
     */
    getQueue(serverId: string): NetworkConnectionRequest[];
    /**
     * Get cache for server
     */
    getCache(serverId: string): Storage | undefined;
    /**
     * Update statistics
     */
    updateStats(): void;
}
