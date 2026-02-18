import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkConnectorSocketModel } from "../interface";
import { NetworkConnectionStatus } from "../../../enums";
/**
 * Network connector socket model
 */
export declare class Model extends BaseModel implements INetworkConnectorSocketModel {
    get status(): NetworkConnectionStatus;
    set status(value: NetworkConnectionStatus);
    get socket(): WebSocket | null;
    set socket(value: WebSocket | null);
    get messageQueue(): any[];
    set messageQueue(value: any[]);
    get pendingRequests(): Map<string, any>;
    set pendingRequests(value: Map<string, any>);
}
