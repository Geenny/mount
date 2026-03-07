import { BaseModel } from "core/base/construction/component/BaseModel";
import { INetworkConnectorSocketModel } from "../interface";
import { NetworkConnectorModel } from "../../connector/mvc/NetworkConnectorModel";

/**
 * Network connector socket model
 */
export class NetworkConnectorSocketModel extends NetworkConnectorModel implements INetworkConnectorSocketModel {
    
    get websocket(): WebSocket | undefined { return this.data.websocket; }
    set websocket( value: WebSocket | undefined ) { this.data.websocket = value; }
    
}