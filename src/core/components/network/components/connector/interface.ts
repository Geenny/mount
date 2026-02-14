import { IComponent } from "core/base/construction/component/interface";
import { NetworkServerConfig, NetworkRequestType, NetworkResponseType } from "../../types";
import { NetworkConnectionStatus } from "../../enums";

/**
 * Network connector component interface
 */
interface INetworkConnectorComponent extends IComponent {
    serverConfig: NetworkServerConfig;
    
    /**
     * Establish connection to server
     */
    connect(): Promise< void >;
    
    /**
     * Close connection to server
     */
    disconnect(): Promise< void >;
    
    /**
     * Send request through this connector
     */
    send( request: NetworkRequestType ): Promise< NetworkResponseType >;
    
    /**
     * Get current connection status
     */
    getStatus(): NetworkConnectionStatus;
    
    /**
     * Check if connector is connected
     */
    isConnected(): boolean;
}

export type {
    INetworkConnectorComponent
};
