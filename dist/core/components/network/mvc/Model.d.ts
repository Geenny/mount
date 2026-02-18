import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkModel } from "../interface";
import { NetworkConnectionRequest, NetworkStatsType } from "../types";
import { Storage } from "utils/storage/Storage";
/**
 * Network component model
 */
export declare class Model extends BaseModel implements INetworkModel {
    get requestQueues(): Map<string, NetworkConnectionRequest[]>;
    set requestQueues(value: Map<string, NetworkConnectionRequest[]>);
    get activeRequests(): Map<string, NetworkConnectionRequest>;
    set activeRequests(value: Map<string, NetworkConnectionRequest>);
    get caches(): Map<string, Storage>;
    set caches(value: Map<string, Storage>);
    get stats(): NetworkStatsType;
    set stats(value: NetworkStatsType);
}
