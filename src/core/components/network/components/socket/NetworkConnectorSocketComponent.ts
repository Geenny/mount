import { NetworkConnectorComponent } from "../connector/NetworkConnectorComponent";
import { NetworkRequestType, NetworkResponseType, NetworkServerConfig } from "../../types";
import { NetworkConnectionStatus } from "../../enums";
import { output } from "utils/index";

/**
 * WebSocket connector component
 */
class NetworkConnectorSocketComponent extends NetworkConnectorComponent {
    
    private socket: WebSocket | null = null;
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private messageQueue: NetworkRequestType[] = [];
    private pendingRequests: Map< string, {
        resolve: ( value: NetworkResponseType ) => void;
        reject: ( reason: any ) => void;
    } > = new Map();
    
    constructor( serverConfig: NetworkServerConfig ) {
        super( serverConfig );
    }
    
    /**
     * Connect to WebSocket server
     */
    async connect(): Promise< void > {
        return new Promise( ( resolve, reject ) => {
            this.setStatus( NetworkConnectionStatus.CONNECTING );
            
            try {
                // Create WebSocket connection
                this.socket = new WebSocket( 
                    this.serverConfig.host, 
                    this.serverConfig.protocols 
                );
                
                // Setup event listeners
                this.socket.onopen = () => {
                    this.setStatus( NetworkConnectionStatus.CONNECTED );
                    output.log( this, `Connected to ${ this.serverConfig.host }` );
                    
                    // Start heartbeat if configured
                    this.startHeartbeat();
                    
                    // Send queued messages
                    this.processMessageQueue();
                    
                    resolve();
                };
                
                this.socket.onerror = ( error ) => {
                    this.setStatus( NetworkConnectionStatus.ERROR );
                    output.error( this, `WebSocket error:`, error );
                    reject( error );
                };
                
                this.socket.onclose = ( event ) => {
                    this.handleClose( event );
                };
                
                this.socket.onmessage = ( event ) => {
                    this.handleMessage( event );
                };
                
            } catch ( error ) {
                this.setStatus( NetworkConnectionStatus.ERROR );
                output.error( this, `Failed to create WebSocket:`, error );
                reject( error );
            }
        } );
    }
    
    /**
     * Disconnect from WebSocket server
     */
    async disconnect(): Promise< void > {
        // Stop heartbeat
        this.stopHeartbeat();
        
        // Stop reconnect timer
        if ( this.reconnectTimer ) {
            clearTimeout( this.reconnectTimer );
            this.reconnectTimer = null;
        }
        
        // Close socket
        if ( this.socket ) {
            this.socket.close();
            this.socket = null;
        }
        
        // Clear queues
        this.messageQueue = [];
        this.pendingRequests.clear();
        
        this.setStatus( NetworkConnectionStatus.DISCONNECTED );
        output.log( this, `Disconnected from ${ this.serverConfig.host }` );
    }
    
    /**
     * Send message through WebSocket
     */
    async send( request: NetworkRequestType ): Promise< NetworkResponseType > {
        return new Promise( ( resolve, reject ) => {
            // If not connected, queue message
            if ( !this.isConnected() || !this.socket ) {
                this.messageQueue.push( request );
                
                // Return pending response
                const networkResponse: NetworkResponseType = {
                    serverId: this.serverConfig.id,
                    requestId: this.generateRequestId(),
                    data: null,
                    status: 0,
                    timestamp: Date.now()
                };
                
                resolve( networkResponse );
                return;
            }
            
            try {
                const requestId = this.generateRequestId();
                
                // Store promise handlers for response
                this.pendingRequests.set( requestId, { resolve, reject } );
                
                // Build message
                const message = {
                    id: requestId,
                    endpoint: request.endpoint,
                    method: request.method,
                    headers: request.headers,
                    body: request.body
                };
                
                // Send message
                this.socket.send( JSON.stringify( message ) );
                
                // Set timeout for response
                const timeout = request.timeout || this.serverConfig.timeout || 30000;
                setTimeout( () => {
                    if ( this.pendingRequests.has( requestId ) ) {
                        this.pendingRequests.delete( requestId );
                        
                        const networkResponse: NetworkResponseType = {
                            serverId: this.serverConfig.id,
                            requestId,
                            data: null,
                            status: 0,
                            error: new Error( 'Request timeout' ),
                            timestamp: Date.now()
                        };
                        
                        reject( networkResponse );
                    }
                }, timeout );
                
            } catch ( error ) {
                const networkResponse: NetworkResponseType = {
                    serverId: this.serverConfig.id,
                    requestId: this.generateRequestId(),
                    data: null,
                    status: 0,
                    error: error as Error,
                    timestamp: Date.now()
                };
                
                reject( networkResponse );
            }
        } );
    }
    
    /**
     * Handle incoming WebSocket message
     */
    private handleMessage( event: MessageEvent ): void {
        try {
            const data = JSON.parse( event.data );
            
            // Check if this is a response to a pending request
            if ( data.id && this.pendingRequests.has( data.id ) ) {
                const { resolve } = this.pendingRequests.get( data.id )!;
                this.pendingRequests.delete( data.id );
                
                const networkResponse: NetworkResponseType = {
                    serverId: this.serverConfig.id,
                    requestId: data.id,
                    data: data.data || data,
                    status: data.status || 200,
                    timestamp: Date.now()
                };
                
                resolve( networkResponse );
            } else {
                // This is a server-initiated message, emit it
                this.emit( `network.message.${ this.serverConfig.id }`, {
                    serverId: this.serverConfig.id,
                    data
                } );
            }
            
        } catch ( error ) {
            output.error( this, `Failed to parse WebSocket message:`, error );
        }
    }
    
    /**
     * Handle WebSocket close event
     */
    private handleClose( event: CloseEvent ): void {
        this.setStatus( NetworkConnectionStatus.DISCONNECTED );
        output.warn( this, `WebSocket closed: ${ event.code } ${ event.reason }` );
        
        // Stop heartbeat
        this.stopHeartbeat();
        
        // Attempt reconnect if configured
        if ( this.serverConfig.reconnectOnClose ) {
            this.attemptReconnect();
        }
    }
    
    /**
     * Attempt to reconnect to WebSocket server
     */
    private attemptReconnect(): void {
        this.setStatus( NetworkConnectionStatus.RECONNECTING );
        
        const retryDelay = this.serverConfig.retryDelay || 2000;
        
        this.reconnectTimer = setTimeout( async () => {
            try {
                await this.connect();
            } catch ( error ) {
                output.warn( this, `Reconnect failed, retrying...` );
                this.attemptReconnect();
            }
        }, retryDelay );
    }
    
    /**
     * Start heartbeat (ping/pong) to keep connection alive
     */
    private startHeartbeat(): void {
        const interval = this.serverConfig.heartbeatInterval || 30000;
        
        this.heartbeatTimer = setInterval( () => {
            if ( this.socket && this.isConnected() ) {
                try {
                    this.socket.send( JSON.stringify( { type: 'ping' } ) );
                } catch ( error ) {
                    output.error( this, `Heartbeat failed:`, error );
                }
            }
        }, interval );
    }
    
    /**
     * Stop heartbeat
     */
    private stopHeartbeat(): void {
        if ( this.heartbeatTimer ) {
            clearInterval( this.heartbeatTimer );
            this.heartbeatTimer = null;
        }
    }
    
    /**
     * Process queued messages after connection
     */
    private processMessageQueue(): void {
        while ( this.messageQueue.length > 0 ) {
            const request = this.messageQueue.shift();
            if ( request ) {
                this.send( request ).catch( error => {
                    output.error( this, `Failed to send queued message:`, error );
                } );
            }
        }
    }
    
    /**
     * Generate unique request ID
     */
    private generateRequestId(): string {
        return `${ this.serverConfig.id }_${ Date.now() }_${ Math.random().toString( 36 ).substr( 2, 9 ) }`;
    }
}

export { NetworkConnectorSocketComponent };
