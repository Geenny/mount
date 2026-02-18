import { BaseController } from "core/base/construction/component/BaseController";
import { INetworkComponent, INetworkController, INetworkModel, INetworkView } from "../interface";
import { NetworkConnectionRequest, NetworkResponseType, NetworkErrorType } from "../types";
/**
 * Network component controller
 * Manages request queues, caching, and routing to connector components
 */
export declare class Controller extends BaseController implements INetworkController {
    protected component: INetworkComponent;
    protected model: INetworkModel;
    protected view: INetworkView;
    constructor(component: INetworkComponent, model: INetworkModel, view: INetworkView);
    /**
     * Start network component
     * Subscribe to network requests from application
     */
    onStart(): Promise<void>;
    /**
     * Initialize caches for connectors
     */
    protected initializeCaches(): void;
    /**
     * Subscribe to network events
     */
    protected subscribeToNetworkEvents(): void;
    /**
     * Handle incoming network request
     */
    protected onRequest(requestConfig: any): void;
    /**
     * Handle response from connector
     */
    protected onResponse(response: NetworkResponseType): void;
    /**
     * Handle error from connector
     */
    protected onError(error: NetworkErrorType): void;
    /**
     * Check if request result is in cache
     */
    protected checkCache(request: NetworkConnectionRequest): boolean;
    /**
     * Add request to queue (sorted by priority)
     */
    protected addToQueue(serverId: string, request: NetworkConnectionRequest): void;
    /**
     * Process request queue for server
     */
    protected processQueue(serverId: string): void;
    /**
     * Check if request should be retried
     */
    protected shouldRetry(request: NetworkConnectionRequest): boolean;
    /**
     * Save response to cache
     */
    protected saveToCache(request: NetworkConnectionRequest, response: NetworkResponseType): void;
    /**
     * Build cache key from request config
     */
    protected buildCacheKey(config: any): string;
    /**
     * Generate unique request ID
     */
    protected generateRequestId(): string;
    /**
     * Model change handler
     */
    onModelChange(key: string, value: any): void;
}
