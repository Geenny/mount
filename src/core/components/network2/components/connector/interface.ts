import { IComponent, IController, IModel } from "core/base/construction/component/interface";
import { NetworkConnectorStatusEnum } from "../../enums";
import {
    NetworkConnectorServerType,
    NetworkConnectorConnectionType,
    NetworkConnectorHealthType,
    NetworkConnectorCacheType,
    NetworkConnectorAuthType,
    NetworkRequestStructType
} from "../../types";

/**
 * Network connector component interface
 */
interface INetworkConnectorComponent extends IComponent {
    
    // /**
    //  * Establish connection to server
    //  */
    // connect(): Promise< void >;
    
    // /**
    //  * Close connection to server
    //  */
    // disconnect(): Promise< void >;
    
    // /**
    //  * Send request through this connector
    //  */
    // send( request: NetworkRequestType ): Promise< NetworkResponseType >;
    
    /**
     * Check if connector is connected
     */
    readonly isConnected: boolean;
    
    /**
     * Get current connection status
     */
    readonly status: NetworkConnectorStatusEnum;

    readonly serverID: string;

    readonly isDefault: boolean;
}

interface INetworkConnectorController extends IController {

}

interface INetworkConnectorModel extends IModel {

    id: string;

    isDefault: boolean;

    status: NetworkConnectorStatusEnum;

    queue: NetworkRequestStructType[];
    queuePending: NetworkRequestStructType[];

    server: NetworkConnectorServerType;

    connection: NetworkConnectorConnectionType;

    health?: NetworkConnectorHealthType;

    cache?: NetworkConnectorCacheType;

    auth?: NetworkConnectorAuthType;

    headers?: Record< string, string >;

}

export type {
    INetworkConnectorComponent,
    INetworkConnectorController,
    INetworkConnectorModel
};
