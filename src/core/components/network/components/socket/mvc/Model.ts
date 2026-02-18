import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkConnectorSocketModel } from "../interface";
import { NetworkConnectionStatus } from "../../../enums";

/**
 * Network connector socket model
 */
export class NetworkConnectorSocketModel extends BaseModel implements INetworkConnectorSocketModel {
    
    get status(): NetworkConnectionStatus {
        return this.data.status || NetworkConnectionStatus.DISCONNECTED;
    }
    set status( value: NetworkConnectionStatus ) {
        this.data.status = value;
    }
    
    get socket(): WebSocket | null {
        return this.data.socket || null;
    }
    set socket( value: WebSocket | null ) {
        this.data.socket = value;
    }
    
    get messageQueue(): any[] {
        return this.data.messageQueue || [];
    }
    set messageQueue( value: any[] ) {
        this.data.messageQueue = value;
    }
    
    get pendingRequests(): Map< string, any > {
        return this.data.pendingRequests || new Map();
    }
    set pendingRequests( value: Map< string, any > ) {
        this.data.pendingRequests = value;
    }
}