import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkComponent, INetworkController, INetworkModel, INetworkView } from "../interface";
import { NetworkConnectorComponent } from "../components/connector/NetworkConnectorComponent";
import { NetworkConnectionRequest, NetworkStatsType } from "../types";
import { Storage } from "utils/storage/Storage";

/**
 * Network component model
 */
export class Model extends BaseModel implements INetworkModel {
    
    protected component: INetworkComponent;
    protected controller: INetworkController;
    protected view: INetworkView;
    
    // Connectors map
    public connectors: Map< string, NetworkConnectorComponent > = new Map();
    
    // Request queues (per server)
    public requestQueues: Map< string, NetworkConnectionRequest[] > = new Map();
    
    // Active requests
    public activeRequests: Map< string, NetworkConnectionRequest > = new Map();
    
    // Caches (per server)
    public caches: Map< string, Storage > = new Map();
    
    // Statistics
    public stats: NetworkStatsType = {
        totalRequests: 0,
        successRequests: 0,
        errorRequests: 0,
        activeRequests: 0,
        queuedRequests: 0
    };
    
    constructor( component: INetworkComponent, controller: INetworkController, view: INetworkView ) {
        super();
        
        this.component = component;
        this.controller = controller;
        this.view = view;
    }
    
    /**
     * Get connector by server ID
     */
    getConnector( serverId: string ): NetworkConnectorComponent | undefined {
        return this.connectors.get( serverId );
    }
    
    /**
     * Get request queue for server
     */
    getQueue( serverId: string ): NetworkConnectionRequest[] {
        return this.requestQueues.get( serverId ) || [];
    }
    
    /**
     * Get cache for server
     */
    getCache( serverId: string ): Storage | undefined {
        return this.caches.get( serverId );
    }
    
    /**
     * Update statistics
     */
    updateStats(): void {
        this.stats.activeRequests = this.activeRequests.size;
        
        let queuedCount = 0;
        for ( const queue of this.requestQueues.values() ) {
            queuedCount += queue.length;
        }
        this.stats.queuedRequests = queuedCount;
    }
}
