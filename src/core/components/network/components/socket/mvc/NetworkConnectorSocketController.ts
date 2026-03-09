import { INetworkConnectorSocketController, INetworkConnectorSocketModel } from "../interface";
import { INetworkConnectorComponent, INetworkConnectorModel } from "../../connector/interface";
import { NetworkConnectorController } from "../../connector/mvc/NetworkConnectorController";
import { NetworkRequestStructType } from "core/components/network/types";
import { PromiseMethodType, PromiseStructType } from "core/base/types";
import { NetworkConnectorStatusEnum } from "core/components/network/enums";
import { output } from "utils/index";
import { NETWORK_EVENT } from "core/constants";

/**
 * Network connector socket controller
 * Handles WebSocket connections
 */
export class NetworkConnectorSocketController extends NetworkConnectorController implements INetworkConnectorSocketController {
    
    protected component: INetworkConnectorComponent;
    protected model: INetworkConnectorSocketModel;
    
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
        return this.promiseManager.get( NetworkConnectorStatusEnum.CONNECTED ) ||
            this.promiseManager.create( NetworkConnectorStatusEnum.CONNECTED, () => this.requestConnectorUnitGet() );
    }

    async disconnect(): Promise<void> {
        if ( this.model.status === NetworkConnectorStatusEnum.DISCONNECTED )
            return Promise.resolve();

        return this.promiseManager.get( NetworkConnectorStatusEnum.DISCONNECTED ) ||
            this.promiseManager.create( NetworkConnectorStatusEnum.DISCONNECTED, () => {
                this.healthTimeoutClear();
                this.webSocketClose();
            } );
    }

    
    protected promiseConnectStructResolve(): void {
        this.promiseManager.resolve( NetworkConnectorStatusEnum.CONNECTED );
    }
    protected promiseConnectStructReject( error: Error ): void {
        this.promiseManager.reject( NetworkConnectorStatusEnum.CONNECTED, error );
    }

    protected promiseDisconnectStructResolve(): void {
        this.promiseManager.resolve( NetworkConnectorStatusEnum.DISCONNECTED );
    }
    protected promiseDisconnectStructReject( error: Error ): void {
        this.promiseManager.reject( NetworkConnectorStatusEnum.DISCONNECTED, error );
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

    protected requestDataFormat( data: string | Object | Blob | ArrayBufferLike | ArrayBufferView<ArrayBufferLike> ): string | Blob | ArrayBufferLike | ArrayBufferView<ArrayBufferLike> {
        if ( !data ) return '';

        if ( data instanceof Blob )
            return data;

        if ( data instanceof ArrayBuffer || ArrayBuffer.isView( data ) )
            return data;

        if ( typeof data === 'string' )
            return data;

        try {
            return JSON.stringify( data );
        } catch ( error ) {
            output.warn( this.component, `Failed any data for request:`, error );
        }

        return String( data );
    }


    //
    // RESPONSE DATA FORMAT
    //

    protected responseDataFormat( data: any ): any {
        try {
            return JSON.parse( data );
        } catch ( error ) { }

        return data;
    }



    //
    // CONNECTOR UNIT
    //

    protected requestConnectorUnitGet(): WebSocket {
        if ( this.model.socket ) return this.model.socket;

        const url = this.requestStructURLGet();

        // Create WebSocket connection
        const socket = new WebSocket( url, this.server.protocols );
        
        // Subscribe to socket events
        this.webSocketSubscribe( socket );

        // Store socket in model
        this.model.socket = socket;

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
        const socket = this.model.socket;
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
        const data = this.responseDataFormat( event.data );
        if ( requestStruct )
            this.requestSendSuccess( requestStruct, data );
        
        this.emit( NETWORK_EVENT.MESSAGE, { data } );
    }

    protected requestSocketError( event: Event ): void {
        const requestStruct = this.model.queuePending[ 0 ];
        if ( requestStruct )
            this.requestSendError( requestStruct, new Error( 'WebSocket error' ) );

        output.warn( this.component, `WebSocket error:`, event );
    }

    protected requestSocketClose( event: CloseEvent ): void {
        this.model.status = NetworkConnectorStatusEnum.DISCONNECTED;
        this.promiseDisconnectStructResolve();
        output.warn( this.component, `WebSocket closed: ${ event.code } ${ event.reason }` );
    }

}
