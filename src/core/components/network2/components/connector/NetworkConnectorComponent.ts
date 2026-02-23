import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { ConfigType } from "core/base/types";
import { INetworkConnectorComponent } from "./interface";
import { NetworkServerConfig, NetworkRequestType, NetworkResponseType } from "../../types";
import { NetworkConnectionStatus } from "../../enums";

/**
 * Abstract network connector component
 * Base class for HTTP and WebSocket connectors
 */
abstract class NetworkConnectorComponent extends StreamSubscribeComponent implements INetworkConnectorComponent {
    
    public serverConfig: NetworkServerConfig;
    protected status: NetworkConnectionStatus = NetworkConnectionStatus.DISCONNECTED;
    
    constructor( serverConfig: NetworkServerConfig ) {
        super();
        
        this.serverConfig = serverConfig;
    }
    
    /**
     * Establish connection to server
     */
    abstract connect(): Promise< void >;
    
    /**
     * Close connection to server
     */
    abstract disconnect(): Promise< void >;
    
    /**
     * Send request through this connector
     */
    abstract send( request: NetworkRequestType ): Promise< NetworkResponseType >;
    
    /**
     * Get current connection status
     */
    getStatus(): NetworkConnectionStatus {
        return this.status;
    }
    
    /**
     * Check if connector is connected
     */
    isConnected(): boolean {
        return this.status === NetworkConnectionStatus.CONNECTED;
    }
    
    /**
     * Update connection status and emit event
     */
    protected setStatus( status: NetworkConnectionStatus ): void {
        this.status = status;
        
        // Emit status change event через stream
        this.emit( `network.status.${ this.serverConfig.id }`, { 
            serverId: this.serverConfig.id,
            status 
        } );
    }
}

export { NetworkConnectorComponent };
