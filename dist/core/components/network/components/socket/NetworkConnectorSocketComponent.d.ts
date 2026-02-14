import { NetworkConnectorComponent } from "../connector/NetworkConnectorComponent";
import { NetworkRequestType, NetworkResponseType, NetworkServerConfig } from "../../types";
/**
 * WebSocket connector component
 */
declare class NetworkConnectorSocketComponent extends NetworkConnectorComponent {
    private socket;
    private heartbeatTimer;
    private reconnectTimer;
    private messageQueue;
    private pendingRequests;
    constructor(serverConfig: NetworkServerConfig);
    /**
     * Connect to WebSocket server
     */
    connect(): Promise<void>;
    /**
     * Disconnect from WebSocket server
     */
    disconnect(): Promise<void>;
    /**
     * Send message through WebSocket
     */
    send(request: NetworkRequestType): Promise<NetworkResponseType>;
    /**
     * Handle incoming WebSocket message
     */
    private handleMessage;
    /**
     * Handle WebSocket close event
     */
    private handleClose;
    /**
     * Attempt to reconnect to WebSocket server
     */
    private attemptReconnect;
    /**
     * Start heartbeat (ping/pong) to keep connection alive
     */
    private startHeartbeat;
    /**
     * Stop heartbeat
     */
    private stopHeartbeat;
    /**
     * Process queued messages after connection
     */
    private processMessageQueue;
    /**
     * Generate unique request ID
     */
    private generateRequestId;
}
export { NetworkConnectorSocketComponent };
