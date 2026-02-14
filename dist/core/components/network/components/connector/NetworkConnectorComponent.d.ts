import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { INetworkConnectorComponent } from "./interface";
import { NetworkServerConfig, NetworkRequestType, NetworkResponseType } from "../../types";
import { NetworkConnectionStatus } from "../../enums";
/**
 * Abstract network connector component
 * Base class for HTTP and WebSocket connectors
 */
declare abstract class NetworkConnectorComponent extends StreamSubscribeComponent implements INetworkConnectorComponent {
    serverConfig: NetworkServerConfig;
    protected status: NetworkConnectionStatus;
    constructor(serverConfig: NetworkServerConfig);
    /**
     * Establish connection to server
     */
    abstract connect(): Promise<void>;
    /**
     * Close connection to server
     */
    abstract disconnect(): Promise<void>;
    /**
     * Send request through this connector
     */
    abstract send(request: NetworkRequestType): Promise<NetworkResponseType>;
    /**
     * Get current connection status
     */
    getStatus(): NetworkConnectionStatus;
    /**
     * Check if connector is connected
     */
    isConnected(): boolean;
    /**
     * Update connection status and emit event
     */
    protected setStatus(status: NetworkConnectionStatus): void;
}
export { NetworkConnectorComponent };
