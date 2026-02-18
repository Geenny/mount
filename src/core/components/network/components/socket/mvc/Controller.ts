import { BaseController } from "core/base/construction/component/BaseController";
import { 
    INetworkConnectorSocketComponent, 
    INetworkConnectorSocketController, 
    INetworkConnectorSocketModel, 
    INetworkConnectorSocketView 
} from "../interface";
import { NetworkRequestType, NetworkResponseType, NetworkServerConfig } from "../../../types";
import { NetworkConnectionStatus } from "../../../enums";
import { NETWORK_EVENT } from "core/constants";
import { output } from "utils/index";

/**
 * Network connector socket controller
 * Handles WebSocket connections
 */
export class NetworkConnectorSocketController extends BaseController implements INetworkConnectorSocketController {
    
    protected component: INetworkConnectorSocketComponent;
    protected model: INetworkConnectorSocketModel;
    protected view: INetworkConnectorSocketView;
    
    private serverConfig: NetworkServerConfig;
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    
    constructor( component: INetworkConnectorSocketComponent, model: INetworkConnectorSocketModel, view: INetworkConnectorSocketView ) {
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
     * Connect to WebSocket server
     */
    async connect(): Promise< void > {
        return new Promise( ( resolve, reject ) => {
            this.setStatus( NetworkConnectionStatus.CONNECTING );
            
            try {
                // Create WebSocket connection
                const socket = new WebSocket( 
                    this.serverConfig.host,
                    this.serverConfig.protocols
                );
                
                this.model.socket = socket;
                
                // Setup event listeners
                socket.onopen = () => {
                    this.handleOpen();
                    resolve();
                };
                
                socket.onerror = ( error ) => {
                    this.handleError( error );
                    reject( error );
                };
                
                socket.onclose = ( event ) => {
                    this.handleClose( event );
                };
                
                socket.onmessage = ( event ) => {
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
        const socket = this.model.socket;
        if ( socket ) {
            socket.close();
            this.model.socket = null;
        }
        
        // Clear queues
        this.model.messageQueue = [];
        this.model.pendingRequests = new Map();
        
        this.setStatus( NetworkConnectionStatus.DISCONNECTED );
        output.log( this, `Disconnected from ${ this.serverConfig.host }` );
        
        // Emit disconnected event
        this.emit( NETWORK_EVENT.DISCONNECTED, {
            serverId: this.serverConfig.id,
            status: NetworkConnectionStatus.DISCONNECTED
        } );
    }
    
    /**
     * Send message through WebSocket
     */
    async send( request: NetworkRequestType ): Promise< NetworkResponseType > {
        return new Promise( ( resolve, reject ) => {
            const socket = this.model.socket;
            
            // If not connected, queue message
            if ( !this.isConnected() || !socket ) {
                const queue = this.model.messageQueue;
                queue.push( request );
                this.model.messageQueue = queue;
                
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
                const pending = this.model.pendingRequests;
                pending.set( requestId, { resolve, reject } );
                this.model.pendingRequests = pending;
                
                // Build message
                const message = {
                    id: requestId,
                    endpoint: request.endpoint,
                    method: request.method,
                    headers: request.headers,
                    body: request.body
                };
                
                // Send message
                socket.send( JSON.stringify( message ) );
                
                // Set timeout for response
                const timeout = request.timeout || this.serverConfig.timeout || 30000;
                setTimeout( () => {
                    const pending = this.model.pendingRequests;
                    if ( pending.has( requestId ) ) {
                        pending.delete( requestId );
                        this.model.pendingRequests = pending;
                        
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
     * Handle WebSocket open event
     */
    protected handleOpen(): void {
        this.setStatus( NetworkConnectionStatus.CONNECTED );
        output.log( this, `Connected to ${ this.serverConfig.host }` );
        
        // Start heartbeat if configured
        this.startHeartbeat();
        
        // Send queued messages
        this.processMessageQueue();
        
        // Emit connected event
        this.emit( NETWORK_EVENT.CONNECTED, {
            serverId: this.serverConfig.id,
            status: NetworkConnectionStatus.CONNECTED
        } );
    }
    
    /**
     * Handle incoming WebSocket message
     */
    protected handleMessage( event: MessageEvent ): void {
        try {
            const data = JSON.parse( event.data );
            
            const pending = this.model.pendingRequests;
            
            // Check if this is a response to a pending request
            if ( data.id && pending.has( data.id ) ) {
                const { resolve } = pending.get( data.id )!;
                pending.delete( data.id );
                this.model.pendingRequests = pending;
                
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
    protected handleClose( event: CloseEvent ): void {
        this.setStatus( NetworkConnectionStatus.DISCONNECTED );
        output.warn( this, `WebSocket closed: ${ event.code } ${ event.reason }` );
        
        // Stop heartbeat
        this.stopHeartbeat();
        
        // Emit disconnected event
        this.emit( NETWORK_EVENT.DISCONNECTED, {
            serverId: this.serverConfig.id,
            status: NetworkConnectionStatus.DISCONNECTED
        } );
        
        // Attempt reconnect if configured
        if ( this.serverConfig.reconnectOnClose ) {
            this.attemptReconnect();
        }
    }
    
    /**
     * Handle WebSocket error event
     */
    protected handleError( error: Event ): void {
        this.setStatus( NetworkConnectionStatus.ERROR );
        output.error( this, `WebSocket error:`, error );
    }
    
    /**
     * Attempt to reconnect to WebSocket server
     */
    protected attemptReconnect(): void {
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
        
        // Emit reconnecting event
        this.emit( NETWORK_EVENT.RECONNECTING, {
            serverId: this.serverConfig.id,
            status: NetworkConnectionStatus.RECONNECTING
        } );
    }
    
    /**
     * Start heartbeat (ping/pong) to keep connection alive
     */
    protected startHeartbeat(): void {
        const interval = this.serverConfig.heartbeatInterval || 30000;
        
        this.heartbeatTimer = setInterval( () => {
            const socket = this.model.socket;
            if ( socket && this.isConnected() ) {
                try {
                    socket.send( JSON.stringify( { type: 'ping' } ) );
                } catch ( error ) {
                    output.error( this, `Heartbeat failed:`, error );
                }
            }
        }, interval );
    }
    
    /**
     * Stop heartbeat
     */
    protected stopHeartbeat(): void {
        if ( this.heartbeatTimer ) {
            clearInterval( this.heartbeatTimer );
            this.heartbeatTimer = null;
        }
    }
    
    /**
     * Process queued messages after connection
     */
    protected processMessageQueue(): void {
        const queue = this.model.messageQueue;
        
        while ( queue.length > 0 ) {
            const request = queue.shift();
            if ( request ) {
                this.send( request ).catch( error => {
                    output.error( this, `Failed to send queued message:`, error );
                } );
            }
        }
        
        this.model.messageQueue = queue;
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
