import { BaseController } from "core/base/construction/component/BaseController";
import { INetworkComponent, INetworkController, INetworkModel, INetworkView } from "../interface";
import { NETWORK_EVENT } from "core/constants";
import { output } from "utils/index";
import { Storage } from "utils/storage/Storage";
import { NetworkConnectionRequest, NetworkResponseType, NetworkErrorType } from "../types";
import { NetworkRequestStatus } from "../enums";

/**
 * Network component controller
 * Manages request queues, caching, and routing to connector components
 */
export class Controller extends BaseController implements INetworkController {
    
    protected component: INetworkComponent;
    protected model: INetworkModel;
    protected view: INetworkView;
    
    constructor( component: INetworkComponent, model: INetworkModel, view: INetworkView ) {
        super( component, model, view );
        
        this.component = component;
        this.model = model;
        this.view = view;
    }
    
    /**
     * Start network component
     * Subscribe to network requests from application
     */
    async onStart(): Promise< void > {
        this.subscribeToNetworkEvents();
        this.initializeCaches();
        
        output.log( this, 'Network component started' );
    }
    
    /**
     * Initialize caches for connectors
     */
    protected initializeCaches(): void {
        // Get connector components from config
        const components = ( this.component as any ).getComponents?.();
        
        if ( components ) {
            for ( const connector of components.values() ) {
                const params = ( connector as any ).config?.params;
                
                if ( params?.cache?.enabled ) {
                    const caches = this.model.caches;
                    caches.set( params.id, new Storage() );
                    this.model.caches = caches;
                    
                    output.log( this, `Cache initialized for ${ params.id }` );
                }
            }
        }
    }
    
    /**
     * Subscribe to network events
     */
    protected subscribeToNetworkEvents(): void {
        // Subscribe to network requests from application
        this.component.subscribe( NETWORK_EVENT.REQUEST, this.onRequest.bind( this ) );
        
        // Subscribe to responses from connectors
        this.component.subscribe( NETWORK_EVENT.RESPONSE, this.onResponse.bind( this ) );
        
        // Subscribe to errors from connectors
        this.component.subscribe( NETWORK_EVENT.ERROR, this.onError.bind( this ) );
    }
    
    /**
     * Handle incoming network request
     */
    protected onRequest( requestConfig: any ): void {
        const { serverId } = requestConfig;
        
        // Create connection request object
        const request: NetworkConnectionRequest = {
            id: this.generateRequestId(),
            config: requestConfig,
            status: NetworkRequestStatus.PENDING,
            priority: requestConfig.priority || 0,
            attempt: 0,
            createdAt: Date.now()
        };
        
        // Check cache
        if ( requestConfig.cache && this.checkCache( request ) ) {
            return; // Response from cache already sent
        }
        
        // Add to queue
        this.addToQueue( serverId, request );
        
        // Update stats
        const stats = this.model.stats;
        stats.totalRequests++;
        this.model.stats = stats;
        
        // Emit queued event
        this.emit( NETWORK_EVENT.REQUEST_QUEUED, request );
        
        // Process queue
        this.processQueue( serverId );
    }
    
    /**
     * Handle response from connector
     */
    protected onResponse( response: NetworkResponseType ): void {
        const { serverId, requestId } = response;
        
        // Remove from active requests
        const activeRequests = this.model.activeRequests;
        const request = activeRequests.get( requestId );
        
        if ( request ) {
            // Save to cache if enabled
            if ( request.config.cache ) {
                this.saveToCache( request, response );
            }
            
            // Update stats
            const stats = this.model.stats;
            stats.successRequests++;
            this.model.stats = stats;
            
            // Remove from active
            activeRequests.delete( requestId );
            this.model.activeRequests = activeRequests;
            
            // Continue processing queue
            this.processQueue( serverId );
        }
    }
    
    /**
     * Handle error from connector
     */
    protected onError( error: NetworkErrorType ): void {
        const { serverId, requestId, request } = error;
        
        // Retry logic
        const shouldRetry = this.shouldRetry( request );
        
        if ( shouldRetry ) {
            request.status = NetworkRequestStatus.RETRY;
            request.attempt++;
            
            output.warn( this, `Request retry (${ request.attempt }): ${ error.error.message }` );
            
            // Add back to queue with delay
            const retryDelay = request.config.retry || 1000;
            setTimeout( () => {
                this.addToQueue( serverId, request );
                this.processQueue( serverId );
            }, retryDelay );
            
        } else {
            // Update stats
            const stats = this.model.stats;
            stats.errorRequests++;
            this.model.stats = stats;
            
            // Remove from active
            const activeRequests = this.model.activeRequests;
            activeRequests.delete( requestId );
            this.model.activeRequests = activeRequests;
            
            // Continue processing queue
            this.processQueue( serverId );
        }
    }
    
    /**
     * Check if request result is in cache
     */
    protected checkCache( request: NetworkConnectionRequest ): boolean {
        const caches = this.model.caches;
        const cache = caches.get( request.config.serverId );
        
        if ( !cache ) {
            return false;
        }
        
        const cacheKey = this.buildCacheKey( request.config );
        const cachedData = cache.get( cacheKey );
        
        if ( cachedData ) {
            output.log( this, `Cache hit for ${ cacheKey }` );
            
            // Emit cached response
            const response: NetworkResponseType = {
                serverId: request.config.serverId,
                requestId: request.id,
                data: cachedData,
                status: 200,
                timestamp: Date.now()
            };
            
            this.emit( NETWORK_EVENT.RESPONSE, response );
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Add request to queue (sorted by priority)
     */
    protected addToQueue( serverId: string, request: NetworkConnectionRequest ): void {
        const requestQueues = this.model.requestQueues;
        const queue = requestQueues.get( serverId ) || [];
        
        queue.push( request );
        
        // Sort by priority (higher = earlier)
        queue.sort( ( a: NetworkConnectionRequest, b: NetworkConnectionRequest ) => b.priority - a.priority );
        
        requestQueues.set( serverId, queue );
        this.model.requestQueues = requestQueues;
    }
    
    /**
     * Process request queue for server
     */
    protected processQueue( serverId: string ): void {
        const requestQueues = this.model.requestQueues;
        const queue = requestQueues.get( serverId ) || [];
        
        // Get next request from queue
        const request = queue.shift();
        if ( !request ) {
            return;
        }
        
        requestQueues.set( serverId, queue );
        this.model.requestQueues = requestQueues;
        
        // Add to active requests
        const activeRequests = this.model.activeRequests;
        activeRequests.set( request.id, request );
        this.model.activeRequests = activeRequests;
        
        // Emit request start event
        this.emit( NETWORK_EVENT.REQUEST_START, request );
    }
    
    /**
     * Check if request should be retried
     */
    protected shouldRetry( request: NetworkConnectionRequest ): boolean {
        const retry = request.config.retry;
        
        if ( retry === undefined ) {
            return false;
        }
        
        if ( retry === -1 ) {
            return true; // Infinite retries
        }
        
        return request.attempt < retry;
    }
    
    /**
     * Save response to cache
     */
    protected saveToCache( request: NetworkConnectionRequest, response: NetworkResponseType ): void {
        const caches = this.model.caches;
        const cache = caches.get( request.config.serverId );
        
        if ( !cache ) {
            return;
        }
        
        const cacheKey = this.buildCacheKey( request.config );
        cache.set( cacheKey, response.data );
        
        output.log( this, `Cached response for ${ cacheKey }` );
    }
    
    /**
     * Build cache key from request config
     */
    protected buildCacheKey( config: any ): string {
        return `${ config.method || 'POST' }_${ config.endpoint }_${ JSON.stringify( config.body || {} ) }`;
    }
    
    /**
     * Generate unique request ID
     */
    protected generateRequestId(): string {
        return `req_${ Date.now() }_${ Math.random().toString( 36 ).substr( 2, 9 ) }`;
    }
    
    /**
     * Model change handler
     */
    onModelChange( key: string, value: any ): void {
        // Handle model changes if needed
    }
}
