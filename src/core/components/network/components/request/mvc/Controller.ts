import { BaseController } from "core/base/construction/component/BaseController";
import { 
    INetworkConnectorRequestComponent, 
    INetworkConnectorRequestController, 
    INetworkConnectorRequestModel, 
    INetworkConnectorRequestView 
} from "../interface";
import { NetworkRequestType, NetworkResponseType, NetworkServerConfig } from "../../../types";
import { NetworkConnectionStatus, NetworkRequestMethod } from "../../../enums";
import { NETWORK_EVENT } from "core/constants";
import { output } from "utils/index";

/**
 * Network connector request controller
 * Handles HTTP/HTTPS requests using fetch API
 */
export class NetworkConnectorRequestController extends BaseController implements INetworkConnectorRequestController {
    
    protected component: INetworkConnectorRequestComponent;
    protected model: INetworkConnectorRequestModel;
    protected view: INetworkConnectorRequestView;
    
    private serverConfig: NetworkServerConfig;
    
    constructor( component: INetworkConnectorRequestComponent, model: INetworkConnectorRequestModel, view: INetworkConnectorRequestView ) {
        super( component, model, view );
        
        this.component = component;
        this.model = model;
        this.view = view;
        
        this.serverConfig = ( component as any ).config.params;
    }
    
    /**
     * Start connector - listen to requests
     */
    async onStart(): Promise< void > {
        this.subscribeToEvents();
    }
    
    /**
     * Subscribe to network events
     */
    protected subscribeToEvents(): void {
        // Listen for requests directed to this connector
        this.component.subscribe( NETWORK_EVENT.REQUEST_START, this.onRequestStart.bind( this ) );
    }
    
    /**
     * Handle request start event
     */
    protected onRequestStart( request: any ): void {
        // Check if this request is for this connector
        if ( request.config.serverId !== this.serverConfig.id ) {
            return;
        }
        
        // Send request
        this.send( request.config )
            .then( ( response ) => {
                this.emit( NETWORK_EVENT.RESPONSE, response );
            } )
            .catch( ( error ) => {
                this.emit( NETWORK_EVENT.ERROR, {
                    serverId: this.serverConfig.id,
                    requestId: request.id,
                    request,
                    error,
                    timestamp: Date.now()
                } );
            } );
    }
    
    /**
     * Connect to server (perform health check if configured)
     */
    async connect(): Promise< void > {
        this.setStatus( NetworkConnectionStatus.CONNECTING );
        
        try {
            // If health check is configured, perform it
            if ( this.serverConfig.healthCheck ) {
                await this.send( this.serverConfig.healthCheck );
            }
            
            this.setStatus( NetworkConnectionStatus.CONNECTED );
            output.log( this, `Connected to ${ this.serverConfig.host }` );
            
            // Emit connected event
            this.emit( NETWORK_EVENT.CONNECTED, {
                serverId: this.serverConfig.id,
                status: NetworkConnectionStatus.CONNECTED
            } );
            
        } catch ( error ) {
            this.setStatus( NetworkConnectionStatus.ERROR );
            output.error( this, `Failed to connect to ${ this.serverConfig.host }:`, error );
            throw error;
        }
    }
    
    /**
     * Disconnect from server (cancel all pending requests)
     */
    async disconnect(): Promise< void > {
        // Cancel all pending requests
        const abortControllers = this.model.abortControllers;
        
        for ( const [ requestId, controller ] of abortControllers ) {
            controller.abort();
        }
        
        this.model.abortControllers = new Map();
        
        this.setStatus( NetworkConnectionStatus.DISCONNECTED );
        output.log( this, `Disconnected from ${ this.serverConfig.host }` );
        
        // Emit disconnected event
        this.emit( NETWORK_EVENT.DISCONNECTED, {
            serverId: this.serverConfig.id,
            status: NetworkConnectionStatus.DISCONNECTED
        } );
    }
    
    /**
     * Send HTTP request
     */
    async send( request: NetworkRequestType ): Promise< NetworkResponseType > {
        const requestId = this.generateRequestId();
        const abortController = new AbortController();
        
        // Store abort controller
        const abortControllers = this.model.abortControllers;
        abortControllers.set( requestId, abortController );
        this.model.abortControllers = abortControllers;
        
        try {
            const response = await this.performFetch( request, abortController );
            
            // Clean up
            abortControllers.delete( requestId );
            this.model.abortControllers = abortControllers;
            
            return response;
            
        } catch ( error ) {
            // Clean up
            abortControllers.delete( requestId );
            this.model.abortControllers = abortControllers;
            
            throw error;
        }
    }
    
    /**
     * Perform fetch request
     */
    protected async performFetch( request: NetworkRequestType, abortController: AbortController ): Promise< NetworkResponseType > {
        const requestId = this.generateRequestId();
        
        try {
            // Build URL
            const url = this.buildUrl( request );
            
            // Build headers
            const headers = this.buildHeaders( request );
            
            // Build fetch options
            const fetchOptions: RequestInit = {
                method: request.method || NetworkRequestMethod.POST,
                headers,
                signal: abortController.signal
            };
            
            // Add body if not GET/HEAD
            if ( request.body && 
                 request.method !== NetworkRequestMethod.GET && 
                 request.method !== NetworkRequestMethod.HEAD ) {
                fetchOptions.body = this.buildBody( request.body, headers );
            }
            
            // Set timeout
            const timeout = request.timeout || this.serverConfig.timeout || 30000;
            const timeoutId = setTimeout( () => abortController.abort(), timeout );
            
            // Perform fetch
            const response = await fetch( url, fetchOptions );
            
            clearTimeout( timeoutId );
            
            // Parse response
            const data = await this.parseResponse( response );
            
            // Build response
            const networkResponse: NetworkResponseType = {
                serverId: this.serverConfig.id,
                requestId,
                data,
                status: response.status,
                headers: this.parseHeaders( response.headers ),
                timestamp: Date.now()
            };
            
            return networkResponse;
            
        } catch ( error ) {
            // Build error response
            const networkResponse: NetworkResponseType = {
                serverId: this.serverConfig.id,
                requestId,
                data: null,
                status: 0,
                error: error as Error,
                timestamp: Date.now()
            };
            
            throw networkResponse;
        }
    }
    
    /**
     * Build request URL with endpoint and salt
     */
    protected buildUrl( request: NetworkRequestType ): string {
        let url = `${ this.serverConfig.host }${ request.endpoint }`;
        
        // Add salt for cache busting
        if ( request.salt ) {
            const separator = url.includes( '?' ) ? '&' : '?';
            url += `${ separator }req_ver=${ request.salt }`;
        }
        
        return url;
    }
    
    /**
     * Build request headers
     */
    protected buildHeaders( request: NetworkRequestType ): Record< string, string > {
        const headers: Record< string, string > = {
            'Content-Type': 'application/json',
            ...( this.serverConfig.headers || {} ),
            ...( request.headers || {} )
        };
        
        // Add auth token if configured
        if ( request.token || this.serverConfig.auth?.token ) {
            const token = request.token || this.serverConfig.auth?.token;
            const headerName = this.serverConfig.auth?.headerName || 'Authorization';
            const headerPrefix = this.serverConfig.auth?.headerPrefix || 'Bearer';
            
            headers[ headerName ] = `${ headerPrefix } ${ token }`;
        }
        
        return headers;
    }
    
    /**
     * Build request body
     */
    protected buildBody( body: any, headers: Record< string, string > ): string | FormData | Blob {
        const contentType = headers[ 'Content-Type' ];
        
        if ( contentType?.includes( 'application/json' ) ) {
            return JSON.stringify( body );
        }
        
        return body;
    }
    
    /**
     * Parse response based on content type
     */
    protected async parseResponse( response: Response ): Promise< any > {
        const contentType = response.headers.get( 'Content-Type' );
        
        if ( contentType?.includes( 'application/json' ) ) {
            return await response.json();
        }
        
        if ( contentType?.includes( 'text/' ) ) {
            return await response.text();
        }
        
        return await response.blob();
    }
    
    /**
     * Parse response headers to object
     */
    protected parseHeaders( headers: Headers ): Record< string, string > {
        const result: Record< string, string > = {};
        
        headers.forEach( ( value, key ) => {
            result[ key ] = value;
        } );
        
        return result;
    }
    
    /**
     * Get current connection status
     */
    getStatus(): NetworkConnectionStatus {
        return this.model.status;
    }
    
    /**
     * Check if connector is connected
     */
    isConnected(): boolean {
        return this.model.status === NetworkConnectionStatus.CONNECTED;
    }
    
    /**
     * Update connection status
     */
    protected setStatus( status: NetworkConnectionStatus ): void {
        this.model.status = status;
    }
    
    /**
     * Generate unique request ID
     */
    protected generateRequestId(): string {
        return `${ this.serverConfig.id }_${ Date.now() }_${ Math.random().toString( 36 ).substr( 2, 9 ) }`;
    }
    
    /**
     * Model change handler
     */
    onModelChange( key: string, value: any ): void {
        // Handle model changes if needed
    }
}
