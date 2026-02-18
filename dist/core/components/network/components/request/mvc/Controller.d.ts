import { BaseController } from "core/base/construction/component/BaseController";
import { INetworkConnectorRequestComponent, INetworkConnectorRequestController, INetworkConnectorRequestModel, INetworkConnectorRequestView } from "../interface";
import { NetworkRequestType, NetworkResponseType } from "../../../types";
import { NetworkConnectionStatus } from "../../../enums";
/**
 * Network connector request controller
 * Handles HTTP/HTTPS requests using fetch API
 */
export declare class Controller extends BaseController implements INetworkConnectorRequestController {
    protected component: INetworkConnectorRequestComponent;
    protected model: INetworkConnectorRequestModel;
    protected view: INetworkConnectorRequestView;
    private serverConfig;
    constructor(component: INetworkConnectorRequestComponent, model: INetworkConnectorRequestModel, view: INetworkConnectorRequestView);
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
     * Connect to server (perform health check if configured)
     */
    connect(): Promise<void>;
    /**
     * Disconnect from server (cancel all pending requests)
     */
    disconnect(): Promise<void>;
    /**
     * Send HTTP request
     */
    send(request: NetworkRequestType): Promise<NetworkResponseType>;
    /**
     * Perform fetch request
     */
    protected performFetch(request: NetworkRequestType, abortController: AbortController): Promise<NetworkResponseType>;
    /**
     * Build request URL with endpoint and salt
     */
    protected buildUrl(request: NetworkRequestType): string;
    /**
     * Build request headers
     */
    protected buildHeaders(request: NetworkRequestType): Record<string, string>;
    /**
     * Build request body
     */
    protected buildBody(body: any, headers: Record<string, string>): string | FormData | Blob;
    /**
     * Parse response based on content type
     */
    protected parseResponse(response: Response): Promise<any>;
    /**
     * Parse response headers to object
     */
    protected parseHeaders(headers: Headers): Record<string, string>;
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
