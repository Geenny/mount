import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkConnectorSocketModel } from "../interface";
import { NetworkConnectorModel } from "../../connector/mvc/NetworkConnectorModel";

/**
 * Network connector socket model
 */
export class NetworkConnectorSocketModel extends NetworkConnectorModel implements INetworkConnectorSocketModel {
    
    get socket(): WebSocket | undefined { return this.data.socket; }
    set socket( value: WebSocket | undefined ) { this.data.socket = value; }
    
}