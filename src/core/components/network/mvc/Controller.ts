import { BaseController } from "core/base/construction/component/BaseController";
import { INetworkComponent, INetworkController, INetworkModel, INetworkView } from "../interface";
import { NETWORK_EVENT } from "core/constants";
import { output } from "utils/index";
import { Storage } from "utils/storage/Storage";
import { NetworkConnectorRequestComponent } from "../components/request/NetworkConnectorRequestComponent";
import { NetworkConnectorSocketComponent } from "../components/socket/NetworkConnectorSocketComponent";
import { 
    NetworkRequestType, 
    NetworkResponseType, 
    NetworkErrorType,
    NetworkConnectionRequest,
    NetworkServerConfig 
} from "../types";
import { 
    NetworkConnectionType, 
    NetworkRequestStatus,
    NetworkConnectionStatus 
} from "../enums";

/**
 * Network component controller
 */
export class Controller extends BaseController implements INetworkController {
    
    protected component: INetworkComponent;
    protected model: INetworkModel;
    protected view: INetworkView;
    
    private params: { servers: NetworkServerConfig[] };
    
    constructor( component: INetworkComponent, model: INetworkModel, view: INetworkView ) {
        super( component, model, view );
        
        this.component = component;
        this.model = model;
        this.view = view;
        
        this.params = ( component as any ).config.params || { servers: [] };
    }
    
    /**
     * Initialize network component
     * Creates connectors and performs health checks
     */
    async onInit(): Promise< void > {
        output.log( this, 'Initializing network component...' );
        
        const healthCheckPromises: Promise< void >[] = [];
        
        // Create connectors for each server
        for ( const serverConfig of this.params.servers ) {
            try {
                await this.createConnector( serverConfig );
                
                // If health check is configured, add to promises
                if ( serverConfig.healthCheck ) {
                    healthCheckPromises.push( 
                        this.healthCheckBlocking( serverConfig ) 
                    );
                }
            } catch ( error ) {
                output.error( this, `Failed to create connector for ${ serverConfig.id }:`, error );
            }
        }
        
        // Wait for all health checks to complete
        if ( healthCheckPromises.length > 0 ) {
            output.log( this, `Waiting for ${ healthCheckPromises.length } health checks...` );
            await Promise.all( healthCheckPromises );
        }
        
        output.log( this, 'Network component initialized' );
    }
    
    /**
     * Start network component
     * Subscribe to network requests from application
     */
    async onStart(): Promise< void > {
        // Subscribe to network requests
        this.component.subscribe( NETWORK_EVENT.REQUEST, this.onRequest.bind( this ) );
        
        output.log( this, 'Network component started' );
    }
    
    /**
     * Stop network component
     * Disconnect all connectors
     */
    async onStop(): Promise< void > {
        // Disconnect all connectors
        for ( const connector of this.model.connectors.values() ) {
            await connector.disconnect();
        }
        
        output.log( this, 'Network component stopped' );
    }
    
    /**
     * Create connector for server
     */
    private async createConnector( config: NetworkServerConfig ): Promise< void > {
        let connector;
        
        // Create connector based on type
        if ( config.type === NetworkConnectionType.HTTP ) {
            connector = new NetworkConnectorRequestComponent( config );
        } else if ( config.type === NetworkConnectionType.WEBSOCKET ) {
            connector = new NetworkConnectorSocketComponent( config );
        } else {
            throw new Error( `Unknown connection type: ${ config.type }` );
        }
        
        // Initialize storage cache if enabled
        if ( config.cache?.enabled ) {
            const storage = new Storage();
            this.model.caches.set( config.id, storage );
        }
        
        // Store connector
        this.model.connectors.set( config.id, connector );
        
        // Initialize request queue
        this.model.requestQueues.set( config.id, [] );
        
        output.log( this, `Created ${ config.type } connector for ${ config.id }` );
    }
    
    /**
     * Perform blocking health check
     */
    private async healthCheckBlocking( config: NetworkServerConfig ): Promise< void > {
        const connector = this.model.getConnector( config.id );
        
        if ( !connector ) {
            throw new Error( `Connector not found: ${ config.id }` );
        }
        
        try {
            await connector.connect();
            output.log( this, `Health check passed for ${ config.id }` );
            
            // Emit connected event
            this.emit( NETWORK_EVENT.CONNECTED, {
                serverId: config.id,
                status: NetworkConnectionStatus.CONNECTED
            } );
        } catch ( error ) {
            output.error( this, `Health check failed for ${ config.id }:`, error );
            throw error;
        }
    }
    
    /**
     * Handle incoming network request
     */
    private onRequest( requestConfig: NetworkRequestType ): void {
        const { serverId } = requestConfig;
        
        // Validate server exists
        const connector = this.model.getConnector( serverId );
        if ( !connector ) {
            output.error( this, `Server not found: ${ serverId }` );
            return;
        }
        
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
        
        // Emit queued event
        this.emit( NETWORK_EVENT.REQUEST_QUEUED, request );
        
        // Update stats
        this.model.stats.totalRequests++;
        this.model.updateStats();
        
        // Process queue
        this.processQueue( serverId );
    }
    
    /**
     * Check if request result is in cache
     */
    private checkCache( request: NetworkConnectionRequest ): boolean {
        const cache = this.model.getCache( request.config.serverId );
        
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
     * Build cache key from request config
     */
    private buildCacheKey( config: NetworkRequestType ): string {
        return `${ config.method || 'POST' }_${ config.endpoint }_${ JSON.stringify( config.body || {} ) }`;
    }
    
    /**
     * Add request to queue (sorted by priority)
     */
    private addToQueue( serverId: string, request: NetworkConnectionRequest ): void {
        const queue = this.model.getQueue( serverId );
        
        queue.push( request );
        
        // Sort by priority (higher = earlier)
        queue.sort( ( a: NetworkConnectionRequest, b: NetworkConnectionRequest ) => b.priority - a.priority );
        
        this.model.requestQueues.set( serverId, queue );
    }
    
    /**
     * Process request queue for server
     */
    private async processQueue( serverId: string ): Promise< void > {
        const connector = this.model.getConnector( serverId );
        const config = this.params.servers.find( s => s.id === serverId );
        const queue = this.model.getQueue( serverId );
        
        if ( !connector || !config ) {
            return;
        }
        
        // For HTTP: check concurrent request limit
        if ( config.type === NetworkConnectionType.HTTP ) {
            const maxConcurrent = config.maxConcurrent || 1;
            const activeCount = Array.from( this.model.activeRequests.values() )
                .filter( r => r.config.serverId === serverId )
                .length;
            
            if ( activeCount >= maxConcurrent ) {
                return; // Wait for slots to free up
            }
        }
        
        // Get next request from queue
        const request = queue.shift();
        if ( !request ) {
            return;
        }
        
        this.model.requestQueues.set( serverId, queue );
        
        // Execute request
        await this.executeRequest( connector, request );
    }
    
    /**
     * Execute network request
     */
    private async executeRequest( 
        connector: any, 
        request: NetworkConnectionRequest 
    ): Promise< void > {
        request.status = NetworkRequestStatus.IN_PROGRESS;
        request.startedAt = Date.now();
        
        // Add to active requests
        this.model.activeRequests.set( request.id, request );
        this.model.updateStats();
        
        // Emit start event
        this.emit( NETWORK_EVENT.REQUEST_START, request );
        
        try {
            // Execute request
            const response: NetworkResponseType = await connector.send( request.config );
            
            request.status = NetworkRequestStatus.SUCCESS;
            request.completedAt = Date.now();
            
            // Save to cache if enabled
            if ( request.config.cache ) {
                this.saveToCache( request, response );
            }
            
            // Emit response
            this.emit( NETWORK_EVENT.RESPONSE, response );
            
            // Update stats
            this.model.stats.successRequests++;
            
        } catch ( error: any ) {
            request.status = NetworkRequestStatus.ERROR;
            request.error = error;
            request.attempt++;
            
            // Check if should retry
            const shouldRetry = this.shouldRetry( request );
            
            if ( shouldRetry ) {
                request.status = NetworkRequestStatus.RETRY;
                
                output.warn( this, `Request retry (${ request.attempt }): ${ error.message }` );
                
                // Add back to queue with delay
                const serverConfig = this.params.servers.find( s => s.id === request.config.serverId );
                const retryDelay = serverConfig?.retryDelay || 1000;
                
                setTimeout( () => {
                    this.addToQueue( request.config.serverId, request );
                    this.processQueue( request.config.serverId );
                }, retryDelay );
                
            } else {
                request.status = NetworkRequestStatus.ERROR;
                request.completedAt = Date.now();
                
                output.warn( this, `Request failed: ${ error.message }` );
                
                // Emit error
                const networkError: NetworkErrorType = {
                    serverId: request.config.serverId,
                    requestId: request.id,
                    request,
                    error,
                    timestamp: Date.now()
                };
                
                this.emit( NETWORK_EVENT.ERROR, networkError );
                
                // Update stats
                this.model.stats.errorRequests++;
            }
            
        } finally {
            // Remove from active requests
            this.model.activeRequests.delete( request.id );
            this.model.updateStats();
            
            // Continue processing queue
            this.processQueue( request.config.serverId );
        }
    }
    
    /**
     * Check if request should be retried
     */
    private shouldRetry( request: NetworkConnectionRequest ): boolean {
        const retry = request.config.retry ?? 
            this.params.servers.find( s => s.id === request.config.serverId )?.retry ?? 
            0;
        
        if ( retry === -1 ) {
            return true; // Infinite retries
        }
        
        return request.attempt < retry;
    }
    
    /**
     * Save response to cache
     */
    private saveToCache( request: NetworkConnectionRequest, response: NetworkResponseType ): void {
        const cache = this.model.getCache( request.config.serverId );
        
        if ( !cache ) {
            return;
        }
        
        const cacheKey = this.buildCacheKey( request.config );
        cache.set( cacheKey, response.data );
        
        output.log( this, `Cached response for ${ cacheKey }` );
    }
    
    /**
     * Generate unique request ID
     */
    private generateRequestId(): string {
        return `req_${ Date.now() }_${ Math.random().toString( 36 ).substr( 2, 9 ) }`;
    }
}
