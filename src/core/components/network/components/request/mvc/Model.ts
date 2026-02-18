import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkConnectorRequestModel } from "../interface";
import { NetworkConnectionStatus } from "../../../enums";

/**
 * Network connector request model
 */
export class NetworkConnectorRequestModel extends BaseModel implements INetworkConnectorRequestModel {
    
    get status(): NetworkConnectionStatus {
        return this.data.status || NetworkConnectionStatus.DISCONNECTED;
    }
    set status( value: NetworkConnectionStatus ) {
        this.data.status = value;
    }
    
    get abortControllers(): Map< string, AbortController > {
        return this.data.abortControllers || new Map();
    }
    set abortControllers( value: Map< string, AbortController > ) {
        this.data.abortControllers = value;
    }
}
