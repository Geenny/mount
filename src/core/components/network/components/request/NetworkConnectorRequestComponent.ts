import { NetworkConnectorComponent } from "../connector/NetworkConnectorComponent";
import { NetworkRequestType, NetworkResponseType, NetworkServerConfig } from "../../types";
import { NetworkConnectionStatus, NetworkRequestMethod } from "../../enums";
import { output } from "utils/index";

/**
 * HTTP/HTTPS connector component using fetch API
 */
class NetworkConnectorRequestComponent extends NetworkConnectorComponent {
    
    private abortControllers: Map< string, AbortController > = new Map();
    
    constructor( serverConfig: NetworkServerConfig ) {
        super( serverConfig );
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
        for ( const [ requestId, controller ] of this.abortControllers ) {
            controller.abort();
            this.abortControllers.delete( requestId );
        }
        
        this.setStatus( NetworkConnectionStatus.DISCONNECTED );
        output.log( this, `Disconnected from ${ this.serverConfig.host }` );
    }
    
    /**
     * Send HTTP request
     */
    async send( request: NetworkRequestType ): Promise< NetworkResponseType > {
        const requestId = this.generateRequestId();
        const abortController = new AbortController();
        
        // Store abort controller
        this.abortControllers.set( requestId, abortController );
        
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
            
            // Clean up
            this.abortControllers.delete( requestId );
            
            return networkResponse;
            
        } catch ( error ) {
            // Clean up
            this.abortControllers.delete( requestId );
            
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
    private buildUrl( request: NetworkRequestType ): string {
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
    private buildHeaders( request: NetworkRequestType ): Record< string, string > {
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
    private buildBody( body: any, headers: Record< string, string > ): string | FormData | Blob {
        const contentType = headers[ 'Content-Type' ];
        
        if ( contentType?.includes( 'application/json' ) ) {
            return JSON.stringify( body );
        }
        
        return body;
    }
    
    /**
     * Parse response based on content type
     */
    private async parseResponse( response: Response ): Promise< any > {
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
    private parseHeaders( headers: Headers ): Record< string, string > {
        const result: Record< string, string > = {};
        
        headers.forEach( ( value, key ) => {
            result[ key ] = value;
        } );
        
        return result;
    }
    
    /**
     * Generate unique request ID
     */
    private generateRequestId(): string {
        return `${ this.serverConfig.id }_${ Date.now() }_${ Math.random().toString( 36 ).substr( 2, 9 ) }`;
    }
}

export { NetworkConnectorRequestComponent };
