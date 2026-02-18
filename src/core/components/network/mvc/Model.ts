import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkModel } from "../interface";
import { NetworkConnectionRequest, NetworkStatsType } from "../types";
import { Storage } from "utils/storage/Storage";

/**
 * Network component model
 */
export class Model extends BaseModel implements INetworkModel {
    
    // Request queues (per server)
    get requestQueues(): Map< string, NetworkConnectionRequest[] > {
        return this.data.requestQueues || new Map();
    }
    set requestQueues( value: Map< string, NetworkConnectionRequest[] > ) {
        this.data.requestQueues = value;
    }
    
    // Active requests
    get activeRequests(): Map< string, NetworkConnectionRequest > {
        return this.data.activeRequests || new Map();
    }
    set activeRequests( value: Map< string, NetworkConnectionRequest > ) {
        this.data.activeRequests = value;
    }
    
    // Caches (per server)
    get caches(): Map< string, Storage > {
        return this.data.caches || new Map();
    }
    set caches( value: Map< string, Storage > ) {
        this.data.caches = value;
    }
    
    // Statistics
    get stats(): NetworkStatsType {
        return this.data.stats || {
            totalRequests: 0,
            successRequests: 0,
            errorRequests: 0,
            activeRequests: 0,
            queuedRequests: 0
        };
    }
    set stats( value: NetworkStatsType ) {
        this.data.stats = value;
    }
    
}
