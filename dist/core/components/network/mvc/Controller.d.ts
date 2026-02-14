import { BaseController } from "core/base/construction/component/BaseController";
import { INetworkComponent, INetworkController, INetworkModel, INetworkView } from "../interface";
/**
 * Network component controller
 */
export declare class Controller extends BaseController implements INetworkController {
    protected component: INetworkComponent;
    protected model: INetworkModel;
    protected view: INetworkView;
    private params;
    constructor(component: INetworkComponent, model: INetworkModel, view: INetworkView);
    /**
     * Initialize network component
     * Creates connectors and performs health checks
     */
    onInit(): Promise<void>;
    /**
     * Start network component
     * Subscribe to network requests from application
     */
    onStart(): Promise<void>;
    /**
     * Stop network component
     * Disconnect all connectors
     */
    onStop(): Promise<void>;
    /**
     * Create connector for server
     */
    private createConnector;
    /**
     * Perform blocking health check
     */
    private healthCheckBlocking;
    /**
     * Handle incoming network request
     */
    private onRequest;
    /**
     * Check if request result is in cache
     */
    private checkCache;
    /**
     * Build cache key from request config
     */
    private buildCacheKey;
    /**
     * Add request to queue (sorted by priority)
     */
    private addToQueue;
    /**
     * Process request queue for server
     */
    private processQueue;
    /**
     * Execute network request
     */
    private executeRequest;
    /**
     * Check if request should be retried
     */
    private shouldRetry;
    /**
     * Save response to cache
     */
    private saveToCache;
    /**
     * Generate unique request ID
     */
    private generateRequestId;
}
