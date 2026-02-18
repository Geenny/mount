import { BaseController } from "core/base/construction/component/BaseController";
import { INetworkConnectorSocketComponent, INetworkConnectorSocketController, INetworkConnectorSocketModel, INetworkConnectorSocketView } from "../interface";
import { NetworkRequestType, NetworkResponseType } from "../../../types";
import { NetworkConnectionStatus } from "../../../enums";
/**
 * Network connector socket controller
 * Handles WebSocket connections
 */
export declare class Controller extends BaseController implements INetworkConnectorSocketController {
    protected component: INetworkConnectorSocketComponent;
    protected model: INetworkConnectorSocketModel;
    protected view: INetworkConnectorSocketView;
    private serverConfig;
    private heartbeatTimer;
    private reconnectTimer;
    constructor(component: INetworkConnectorSocketComponent, model: INetworkConnectorSocketModel, view: INetworkConnectorSocketView);
    /**
     * Start connector - listen to requests
     */
    onStart(): Promise<void>;
    /**
     * Subscribe to network events
     */
    protected subscribeToEvents(): void;
    /**
     * Handle request start event
     */
    protected onRequestStart(request: any): void;
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
     * Handle WebSocket open event
     */
    protected handleOpen(): void;
    /**
     * Handle incoming WebSocket message
     */
    protected handleMessage(event: MessageEvent): void;
    /**
     * Handle WebSocket close event
     */
    protected handleClose(event: CloseEvent): void;
    /**
     * Handle WebSocket error event
     */
    protected handleError(error: Event): void;
    /**
     * Attempt to reconnect to WebSocket server
     */
    protected attemptReconnect(): void;
    /**
     * Start heartbeat (ping/pong) to keep connection alive
     */
    protected startHeartbeat(): void;
    /**
     * Stop heartbeat
     */
    protected stopHeartbeat(): void;
    /**
     * Process queued messages after connection
     */
    protected processMessageQueue(): void;
    /**
     * Get current connection status
     */
    getStatus(): NetworkConnectionStatus;
    /**
     * Check if connector is connected
     */
    isConnected(): boolean;
    /**
     * Update connection status
     */
    protected setStatus(status: NetworkConnectionStatus): void;
    /**
     * Generate unique request ID
     */
    protected generateRequestId(): string;
    /**
     * Model change handler
     */
    onModelChange(key: string, value: any): void;
}
