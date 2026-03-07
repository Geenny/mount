import { INetworkConnectorSocketController, INetworkConnectorSocketModel } from "../interface";
import { INetworkConnectorComponent, INetworkConnectorModel } from "../../connector/interface";
import { NetworkConnectorController } from "../../connector/mvc/NetworkConnectorController";
import { NetworkRequestStructType } from "core/components/network2/types";
import { PromiseMethodType, PromiseStructType } from "core/base/types";
import { NetworkConnectorStatusEnum } from "core/components/network2/enums";
import { output } from "utils/index";

/**
 * Network connector socket controller
 * Handles WebSocket connections
 */
export class NetworkConnectorSocketController extends NetworkConnectorController implements INetworkConnectorSocketController {
    
    protected component: INetworkConnectorComponent;
    protected model: INetworkConnectorSocketModel;
    
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private promiseConnectStruct?: PromiseStructType;
    private promiseDisconnectStruct?: PromiseStructType;
    
    constructor( component: INetworkConnectorComponent, model: INetworkConnectorModel ) {

        super( component, model );
        
        this.component = component;
        this.model = model;

    }


    //
    // GETTERS
    //

    get concurrent(): number {
        return 1;   // WebSocket is single connection, so concurrent requests are not supported
    }



    //
    // CONNECT
    //

    async connect(): Promise<void> {
        this.promiseConnectStruct = this.promiseConnectStruct ||
            this.promiseStructGet( () => this.requestConnectorUnitGet() );

        return this.promiseConnectStruct.promise;
    }

    async disconnect(): Promise<void> {
        if ( this.model.status === NetworkConnectorStatusEnum.DISCONNECTED )
            return Promise.resolve();

        this.promiseDisconnectStruct = this.promiseDisconnectStruct ||
            this.promiseStructGet( () => {
                this.healthTimeoutClear();
                this.webSocketClose();
            } );
    
        return this.promiseDisconnectStruct.promise;
    }

    protected promiseStructGet( method?: Function ): PromiseStructType {
        const methods: PromiseMethodType = { resolve: () => {} };
        const promise = new Promise<void>( ( resolve, reject ) => {
            methods.resolve = resolve;
            methods.reject = reject;

            method?.();
        });

        return { promise, method: methods };
    }
    
    protected promiseConnectStructResolve(): void {
        if ( !this.promiseConnectStruct ) return;
        this.promiseConnectStruct.method.resolve();
        this.promiseConnectStruct = undefined;
    }
    protected promiseConnectStructReject( error: Error ): void {
        if ( !this.promiseConnectStruct ) return;
        this.promiseConnectStruct.method.reject?.( error );
        this.promiseConnectStruct = undefined;
    }

    protected promiseDisconnectStructResolve(): void {
        if ( !this.promiseDisconnectStruct ) return;
        this.promiseDisconnectStruct.method.resolve();
        this.promiseDisconnectStruct = undefined;
    }
    protected promiseDisconnectStructReject( error: Error ): void {
        if ( !this.promiseDisconnectStruct ) return;
        this.promiseDisconnectStruct.method.reject?.( error );
        this.promiseDisconnectStruct = undefined;
    }


    //
    // REQUEST SEND
    //
    
    protected requestSend( requestStruct: NetworkRequestStructType ): void {
        const { data, connectorUnit } = requestStruct;

        if ( !connectorUnit || !( connectorUnit instanceof WebSocket ) ) {
            output.error( this.component, `Unsupported connector unit for request:`, requestStruct );
            this.requestOnError( requestStruct, new Error( 'Unsupported connector unit' ) );
            return;
        }

        // Send request
        try {
            connectorUnit.send( this.requestDataFormat( data ) );
        } catch ( error ) {
            output.error( this.component, `Request send error:`, error );
        }
    }



    //
    // REQUEST DATA FORMAT
    //

    protected requestDataFormat( data: any ): string {
        if ( !data ) return '';

        if ( typeof data === 'string' )
            return data;

        if ( typeof data === 'object' )
            return JSON.stringify( data );

        return String( data );
    }




    //
    // CONNECTOR UNIT
    //

    protected requestConnectorUnitGet(): WebSocket {
        if ( this.model.websocket ) return this.model.websocket;

        const url = this.requestStructURLGet();

        // Create WebSocket connection
        const socket = new WebSocket( url, this.server.protocols );
        
        // Subscribe to socket events
        this.webSocketSubscribe( socket );

        // Store socket in model
        this.model.websocket = socket;

        return socket;
    }

    protected webSocketSubscribe( socket: WebSocket ): void {
        if ( !socket ) return;
        socket.onopen = ( event: Event ) => this.requestSocketOpen( event );
        socket.onerror = ( event: Event ) => this.requestSocketError( event );
        socket.onclose = ( event: CloseEvent ) => this.requestSocketClose( event );
        socket.onmessage = ( event: MessageEvent ) => this.requestSocketMessage( event );
    }
    protected webSocketUnsubscribe( socket: WebSocket ): void {
        if ( !socket ) return;
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
    }
    protected webSocketClose(): void {
        const socket = this.model.websocket;
        if ( !socket ) return;
        socket.close();
    }



    protected requestSocketOpen( event: Event ): void {
        this.model.status = NetworkConnectorStatusEnum.CONNECTED;
        this.promiseConnectStructResolve();
        output.log( this.component, `WebSocket connection opened`, event );
    }

    protected requestSocketMessage( event: MessageEvent ): void {
        const requestStruct = this.model.queuePending[ 0 ];
        if ( requestStruct )
            this.requestSendSuccess( requestStruct, event.data );
        
        // this.emit()
    }

    protected requestSocketError( event: Event ): void {
        output.warn( this.component, `WebSocket error:`, event );
    }

    protected requestSocketClose( event: CloseEvent ): void {
        this.model.status = NetworkConnectorStatusEnum.DISCONNECTED;
        this.promiseDisconnectStructResolve();
        output.warn( this.component, `WebSocket closed: ${ event.code } ${ event.reason }` );
    }




    
    /**
     * Start connector - listen to requests
     */
    // async onStart(): Promise< void > {
    //     // this.subscribeToEvents();
        
    //     // Connect to WebSocket server
    //     // await this.connect();
    // }
    
    /**
     * Stop connector - disconnect and cleanup
     */
    // async onStop(): Promise< void > {
    //     // await this.disconnect();
    // }
    
    // /**
    //  * Subscribe to network events
    //  */
    // protected subscribeToEvents(): void {
    //     // Listen for requests directed to this connector
    //     this.component.subscribe( NETWORK_EVENT.REQUEST_START, this.onRequestStart.bind( this ) );
    // }
    
    // /**
    //  * Handle request start event
    //  */
    // protected onRequestStart( request: any ): void {
    //     // Check if this request is for this connector
    //     if ( request.config.serverId !== this.serverConfig.id ) {
    //         return;
    //     }
        
    //     // Send request
    //     this.send( request.config )
    //         .then( ( response ) => {
    //             this.emit( NETWORK_EVENT.RESPONSE, response );
    //         } )
    //         .catch( ( error ) => {
    //             this.emit( NETWORK_EVENT.ERROR, {
    //                 serverId: this.serverConfig.id,
    //                 requestId: request.id,
    //                 request,
    //                 error,
    //                 timestamp: Date.now()
    //             } );
    //         } );
    // }
    
    // /**
    //  * Connect to WebSocket server
    //  */
    // async connect(): Promise< void > {
    //     return new Promise( ( resolve, reject ) => {
    //         this.setStatus( NetworkConnectionStatus.CONNECTING );
            
    //         // Check if WebSocket is available (not in Node.js test environment)
    //         if ( typeof WebSocket === 'undefined' ) {
    //             output.warn( this, `Skipping WebSocket connection - WebSocket not available (test environment?)` );
    //             this.setStatus( NetworkConnectionStatus.CONNECTED );
    //             resolve();
    //             return;
    //         }
            
    //         try {
    //             // Create WebSocket connection
    //             const socket = new WebSocket( 
    //                 this.serverConfig.host,
    //                 this.serverConfig.protocols
    //             );
                
    //             this.model.socket = socket;
                
    //             // Setup event listeners
    //             socket.onopen = () => {
    //                 this.handleOpen();
    //                 resolve();
    //             };
                
    //             socket.onerror = ( error ) => {
    //                 this.handleError( error );
                    
    //                 // Don't reject - allow connector to work in degraded mode
    //                 output.warn( this, `WebSocket connection failed, but continuing in degraded mode` );
    //                 this.setStatus( NetworkConnectionStatus.CONNECTED );
    //                 resolve();
    //             };
                
    //             socket.onclose = ( event ) => {
    //                 this.handleClose( event );
    //             };
                
    //             socket.onmessage = ( event ) => {
    //                 this.handleMessage( event );
    //             };
                
    //             // Set connection timeout
    //             setTimeout( () => {
    //                 if ( this.model.status === NetworkConnectionStatus.CONNECTING ) {
    //                     output.warn( this, `WebSocket connection timeout, continuing anyway` );
    //                     this.setStatus( NetworkConnectionStatus.CONNECTED );
    //                     resolve();
    //                 }
    //             }, this.serverConfig.timeout || 5000 );
                
    //         } catch ( error ) {
    //             output.warn( this, `Failed to create WebSocket, continuing anyway:`, error );
    //             this.setStatus( NetworkConnectionStatus.CONNECTED );
    //             resolve();
    //         }
    //     } );
    // }
    
    // /**
    //  * Disconnect from WebSocket server
    //  */
    // async disconnect(): Promise< void > {
    //     // Stop heartbeat
    //     this.stopHeartbeat();
        
    //     // Stop reconnect timer
    //     if ( this.reconnectTimer ) {
    //         clearTimeout( this.reconnectTimer );
    //         this.reconnectTimer = null;
    //     }
        
    //     // Close socket
    //     const socket = this.model.socket;
    //     if ( socket ) {
    //         socket.close();
    //         this.model.socket = null;
    //     }
        
    //     // Clear queues
    //     this.model.messageQueue = [];
    //     this.model.pendingRequests = new Map();
        
    //     this.setStatus( NetworkConnectionStatus.DISCONNECTED );
    //     output.log( this, `Disconnected from ${ this.serverConfig.host }` );
        
    //     // Emit disconnected event
    //     this.emit( NETWORK_EVENT.DISCONNECTED, {
    //         serverId: this.serverConfig.id,
    //         status: NetworkConnectionStatus.DISCONNECTED
    //     } );
    // }
    
    // /**
    //  * Send message through WebSocket
    //  */
    // async send( request: NetworkRequestType ): Promise< NetworkResponseType > {
    //     return new Promise( ( resolve, reject ) => {
    //         const socket = this.model.socket;
            
    //         // If not connected, queue message
    //         if ( !this.isConnected() || !socket ) {
    //             const queue = this.model.messageQueue;
    //             queue.push( request );
    //             this.model.messageQueue = queue;
                
    //             // Return pending response
    //             const networkResponse: NetworkResponseType = {
    //                 serverId: this.serverConfig.id,
    //                 requestId: this.generateRequestId(),
    //                 data: null,
    //                 status: 0,
    //                 timestamp: Date.now()
    //             };
                
    //             resolve( networkResponse );
    //             return;
    //         }
            
    //         try {
    //             const requestId = this.generateRequestId();
                
    //             // Store promise handlers for response
    //             const pending = this.model.pendingRequests;
    //             pending.set( requestId, { resolve, reject } );
    //             this.model.pendingRequests = pending;
                
    //             // Build message
    //             const message = {
    //                 id: requestId,
    //                 endpoint: request.endpoint,
    //                 method: request.method,
    //                 headers: request.headers,
    //                 data: request.data
    //             };
                
    //             // Send message
    //             socket.send( JSON.stringify( message ) );
                
    //             // Set timeout for response
    //             const timeout = request.timeout || this.serverConfig.timeout || 30000;
    //             setTimeout( () => {
    //                 const pending = this.model.pendingRequests;
    //                 if ( pending.has( requestId ) ) {
    //                     pending.delete( requestId );
    //                     this.model.pendingRequests = pending;
                        
    //                     const networkResponse: NetworkResponseType = {
    //                         serverId: this.serverConfig.id,
    //                         requestId,
    //                         data: null,
    //                         status: 0,
    //                         error: new Error( 'Request timeout' ),
    //                         timestamp: Date.now()
    //                     };
                        
    //                     reject( networkResponse );
    //                 }
    //             }, timeout );
                
    //         } catch ( error ) {
    //             const networkResponse: NetworkResponseType = {
    //                 serverId: this.serverConfig.id,
    //                 requestId: this.generateRequestId(),
    //                 data: null,
    //                 status: 0,
    //                 error: error as Error,
    //                 timestamp: Date.now()
    //             };
                
    //             reject( networkResponse );
    //         }
    //     } );
    // }
    
    // /**
    //  * Handle WebSocket open event
    //  */
    // protected handleOpen(): void {
    //     this.setStatus( NetworkConnectionStatus.CONNECTED );
    //     output.log( this, `Connected to ${ this.serverConfig.host }` );
        
    //     // Start heartbeat if configured
    //     this.startHeartbeat();
        
    //     // Send queued messages
    //     this.processMessageQueue();
        
    //     // Emit connected event
    //     this.emit( NETWORK_EVENT.CONNECTED, {
    //         serverId: this.serverConfig.id,
    //         status: NetworkConnectionStatus.CONNECTED
    //     } );
    // }
    
    // /**
    //  * Handle incoming WebSocket message
    //  */
    // protected handleMessage( event: MessageEvent ): void {
    //     try {
    //         const data = JSON.parse( event.data );
            
    //         const pending = this.model.pendingRequests;
            
    //         // Check if this is a response to a pending request
    //         if ( data.id && pending.has( data.id ) ) {
    //             const { resolve } = pending.get( data.id )!;
    //             pending.delete( data.id );
    //             this.model.pendingRequests = pending;
                
    //             const networkResponse: NetworkResponseType = {
    //                 serverId: this.serverConfig.id,
    //                 requestId: data.id,
    //                 data: data.data || data,
    //                 status: data.status || 200,
    //                 timestamp: Date.now()
    //             };
                
    //             resolve( networkResponse );
    //         } else {
    //             // This is a server-initiated message, emit it
    //             this.emit( `network.message.${ this.serverConfig.id }`, {
    //                 serverId: this.serverConfig.id,
    //                 data
    //             } );
    //         }
            
    //     } catch ( error ) {
    //         output.error( this, `Failed to parse WebSocket message:`, error );
    //     }
    // }
    
    // /**
    //  * Handle WebSocket close event
    //  */
    // protected handleClose( event: CloseEvent ): void {
    //     this.setStatus( NetworkConnectionStatus.DISCONNECTED );
    //     output.warn( this, `WebSocket closed: ${ event.code } ${ event.reason }` );
        
    //     // Stop heartbeat
    //     this.stopHeartbeat();
        
    //     // Emit disconnected event
    //     this.emit( NETWORK_EVENT.DISCONNECTED, {
    //         serverId: this.serverConfig.id,
    //         status: NetworkConnectionStatus.DISCONNECTED
    //     } );
        
    //     // Attempt reconnect if configured
    //     if ( this.serverConfig.reconnectOnClose ) {
    //         this.attemptReconnect();
    //     }
    // }
    
    // /**
    //  * Handle WebSocket error event
    //  */
    // protected handleError( error: Event ): void {
    //     this.setStatus( NetworkConnectionStatus.ERROR );
    //     output.error( this, `WebSocket error:`, error );
    // }
    
    // /**
    //  * Attempt to reconnect to WebSocket server
    //  */
    // protected attemptReconnect(): void {
    //     this.setStatus( NetworkConnectionStatus.RECONNECTING );
        
    //     const retryDelay = this.serverConfig.retryDelay || 2000;
        
    //     this.reconnectTimer = setTimeout( async () => {
    //         try {
    //             await this.connect();
    //         } catch ( error ) {
    //             output.warn( this, `Reconnect failed, retrying...` );
    //             this.attemptReconnect();
    //         }
    //     }, retryDelay );
        
    //     // Emit reconnecting event
    //     this.emit( NETWORK_EVENT.RECONNECTING, {
    //         serverId: this.serverConfig.id,
    //         status: NetworkConnectionStatus.RECONNECTING
    //     } );
    // }
    
    // /**
    //  * Start heartbeat (ping/pong) to keep connection alive
    //  */
    // protected startHeartbeat(): void {

    //     // Heartbeat already running
    //     if ( this.heartbeatTimer ) return; 

    //     const interval = this.serverConfig.heartbeatInterval || 30000;
        
    //     this.heartbeatTimer = setInterval( () => {
    //         const socket = this.model.socket;
    //         if ( socket && this.isConnected() ) {
    //             try {
    //                 socket.send( JSON.stringify( { type: 'PING' } ) );
    //             } catch ( error ) {
    //                 output.error( this, `Heartbeat failed:`, error );
    //             }
    //         }
    //     }, interval );
    // }
    
    // /**
    //  * Stop heartbeat
    //  */
    // protected stopHeartbeat(): void {
    //     if ( !this.heartbeatTimer ) return;
        
    //     clearInterval( this.heartbeatTimer );
    //     this.heartbeatTimer = null;
    // }
    
    // /**
    //  * Process queued messages after connection
    //  */
    // protected processMessageQueue(): void {
    //     const queue = this.model.messageQueue;
        
    //     while ( queue.length > 0 ) {
    //         const request = queue.shift();
    //         if ( request ) {
    //             this.send( request ).catch( error => {
    //                 output.error( this, `Failed to send queued message:`, error );
    //             } );
    //         }
    //     }
        
    //     this.model.messageQueue = queue;
    // }
    
    // /**
    //  * Get current connection status
    //  */
    // getStatus(): NetworkConnectionStatus {
    //     return this.model.status;
    // }
    
    // /**
    //  * Check if connector is connected
    //  */
    // isConnected(): boolean {
    //     return this.model.status === NetworkConnectionStatus.CONNECTED;
    // }
    
    // /**
    //  * Update connection status
    //  */
    // protected setStatus( status: NetworkConnectionStatus ): void {
    //     this.model.status = status;
    // }
    
    // /**
    //  * Generate unique request ID
    //  */
    // protected generateRequestId(): string {
    //     return `${ this.serverConfig.id }_${ Date.now() }_${ Math.random().toString( 36 ).substr( 2, 9 ) }`;
    // }
    
    // /**
    //  * Model change handler
    //  */
    // onModelChange( key: string, value: any ): void {
    //     // Handle model changes if needed
    // }
}
