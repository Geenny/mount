import { INetworkConnectorRequestController } from "../interface";
import { INetworkConnectorComponent, INetworkConnectorModel } from "../../connector/interface";
import { NetworkConnectorController } from "../../connector/mvc/NetworkConnectorController";
import { NetworkRequestStructType } from "core/components/network/types";
import { output } from "utils/index";

/**
 * Network connector request controller
 * Handles HTTP/HTTPS requests using fetch API
 */
export class NetworkConnectorRequestController extends NetworkConnectorController implements INetworkConnectorRequestController {
    
    protected component: INetworkConnectorComponent;
    protected model: INetworkConnectorModel;
    
    constructor( component: INetworkConnectorComponent, model: INetworkConnectorModel ) {
        super( component, model );
        
        this.component = component;
        this.model = model;
    }



    //
    // REQUEST SEND
    //
    
    protected requestSend( requestStruct: NetworkRequestStructType ): void {
        const { data, connectorUnit } = requestStruct;

        if ( !connectorUnit || !( connectorUnit instanceof XMLHttpRequest ) ) {
            output.error( this.component, `Unsupported connector unit for request:`, requestStruct );
            this.requestOnError( requestStruct, new Error( 'Unsupported connector unit' ) );
            return;
        }

        // Connector Unit subscribe
        this.requestSendConnectorUnitSubscribe( connectorUnit, requestStruct );

        // WithCredentials for cookies
        this.requestSendWithCredentialsSet( requestStruct );

        // Timeout
        this.requestSendTimeoutSet( requestStruct );

        // Open connection
        this.requestSendOpen( requestStruct );

        // Set headers
        this.requestSendHeadersSet( requestStruct );

        // Send request
        try {
            connectorUnit.send( data );
        } catch ( error ) {
            output.error( this.component, `Request send error:`, error );
        }
    }


    //
    // REQUEST WITH CREDENTIALS
    //

    protected requestSendWithCredentialsSet( requestStruct: NetworkRequestStructType ): void {
        const { connectorUnit } = requestStruct;
        // connectorUnit.withCredentials = true; // for cookies
    }


    //
    // REQUEST TIMEOUT
    //

    protected requestSendTimeoutSet( requestStruct: NetworkRequestStructType ): void {
        const { connectorUnit } = requestStruct;
        if ( this.timeout > 0 ) connectorUnit.timeout = this.timeout;
    }


    //
    // REQUEST OPEN
    //

    protected requestSendOpen( requestStruct: NetworkRequestStructType ): void {
        const { connectorUnit, method, url } = requestStruct;
        connectorUnit.open( method, url, true );
    }


    //
    // REQUEST HEADERS
    //

    protected requestSendHeadersSet( requestStruct: NetworkRequestStructType ): void {
        const { connectorUnit, headers } = requestStruct;
        if ( !headers ) return;
        for ( const key in headers ) {
            if ( headers.hasOwnProperty( key ) ) {
                connectorUnit.setRequestHeader( key, headers[ key ] );
            }
        }
    }



    //
    // CONNECTOR UNIT
    //

    protected requestConnectorUnitGet(): XMLHttpRequest {
        return new XMLHttpRequest();;
    }

    protected requestConnectorUnitClear( requestStruct: NetworkRequestStructType ): void {
        const { connectorUnit } = requestStruct;
        if ( !connectorUnit || !( connectorUnit instanceof XMLHttpRequest ) ) return;
        connectorUnit.onreadystatechange = null;
        connectorUnit.onloadstart = null;
        connectorUnit.onerror = null;
        connectorUnit.onabort = null;
        connectorUnit.ontimeout = null;
        connectorUnit.onprogress = null;
        connectorUnit.onload = null;
    }

    protected requestSendConnectorUnitSubscribe( xhr: XMLHttpRequest, requestStruct: NetworkRequestStructType ): void {
        xhr.onreadystatechange = (data) => {
            // console.log( 'readyState', xhr.readyState, xhr.status, xhr.statusText );
        };
        xhr.onloadstart = () => this.requestSendStart( requestStruct );
        xhr.onerror = ( event: ProgressEvent ) => this.requestSendError( requestStruct, new Error( event.toString() ) );
        xhr.onabort = () => this.requestSendError( requestStruct, new Error( 'Request aborted' ) );
        xhr.ontimeout = () => this.requestSendTimeout( requestStruct );
        xhr.onprogress = ( event: ProgressEvent ) => {
            requestStruct.progress = event.lengthComputable ? event.loaded / event.total : 0;
            this.requestSendProgress( requestStruct );
        };
        xhr.onload = ( event: ProgressEvent ) => this.requestSendSuccess( requestStruct, xhr.response );
    }

}
