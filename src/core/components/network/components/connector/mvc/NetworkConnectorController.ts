import { BaseController } from "core/base/construction/component/BaseController";
import { INetworkConnectorController, INetworkConnectorModel } from "../interface";
import { INetworkConnectorComponent } from "../interface";
import { RecipientEvent } from "core/base/construction/recipient/types";
import { NetworkConnectorHealthType, NetworkConnectorServerType, NetworkRequestStructType, NetworkRequestType } from "../../../types";
import { Unique } from "utils/unique/Unique";
import { output } from "utils/index";
import { NetworkConnectorStatusEnum, NetworkProtocolEnum, NetworkRequestMethodEnum, NetworkRequestStatusEnum } from "core/components/network/enums";

const HEALTH_CHECK = "HEALTH_CHECK";
const HEALTH_CHECK_TIMEOUT = "HEALTH_CHECK_TIMEOUT";

/**
 * Network connector request controller
 * Handles HTTP/HTTPS requests using fetch API
 */
export class NetworkConnectorController extends BaseController implements INetworkConnectorController {
    
    protected component: INetworkConnectorComponent;
    protected model: INetworkConnectorModel;

    protected requestUnique = new Unique( 1 );
    
    constructor( component: INetworkConnectorComponent, model: INetworkConnectorModel ) {
        super( component, model );
        
        this.component = component;
        this.model = model;
    }


    //
    // GETTERS
    //

    get server(): NetworkConnectorServerType {
        return this.model.server;
    }

    get concurrent(): number {
        return this.model?.connection?.concurrent ?? 1;
    }

    get timeout(): number {
        return this.model?.connection?.timeout ?? 30000;
    }

    get retry(): number {
        return this.model?.connection?.retry ?? 0;
    }

    get retryDelay(): number {
        return this.model?.connection?.retryDelay ?? 100;
    }

    get health(): NetworkConnectorHealthType | undefined {
        return this.model?.health;
    }


    //
    // LIFECYCLE
    //
    
    /**
     * Start connector - listen to requests
     */
    async onStart(): Promise< void > {
        await super.onStart();
        await this.connect();
        await this.healthCheck();
    }
    
    /**
     * Stop connector - disconnect and cleanup
     */
    async onStop(): Promise< void > {
        await super.onStop();
        await this.disconnect();
    }


    //
    // CONNECT
    //

    async connect(): Promise< void > {
        if ( this.component.isConnected ) return;

        return new Promise( ( resolve, reject ) => {
            this.model.status = NetworkConnectorStatusEnum.CONNECTED;
            resolve();
        });
    }

    async disconnect(): Promise< void > {
        if ( !this.component.isConnected ) return;

        return new Promise( ( resolve, reject ) => {
            this.model.status = NetworkConnectorStatusEnum.DISCONNECTED;
            resolve();
        });
    }



    //
    // EVENTS
    //

    onEvent( event: RecipientEvent, request: NetworkRequestType ): void {
        if ( event !== "send" ) return;

        this.request( request );
    }


    //
    // REQUEST
    //

    protected request( request: NetworkRequestType ): void {
        const requestStruct = this.requestStructGet( request );

        this.requestToQueueAdd( requestStruct );

        this.requestNext();
    }

    protected requestNext(): void {

        // No requests in queue
        if ( this.model.queue.length <= 0 ) return;

        // Check concurrent limit
        if ( this.model.queuePending.length >= this.concurrent ) return;

        // Move next request from queue to pending
        const requestStruct = this.model.queue.shift();
        if ( requestStruct ) {
            this.requestPendingAdd( requestStruct );
            this.requestPendingAll();
        }

        // Process next request in queue
        this.requestNext();

    }

    protected requestToQueueAdd( requestStruct: NetworkRequestStructType ): void {
        this.model.queue.push( requestStruct );
        this.model.queue.sort( ( struct1, struct2 ) => struct2.priority - struct1.priority );
    }



    //
    // STATUS
    //

    protected requestStatus( requestStruct: NetworkRequestStructType, status: NetworkRequestStatusEnum ): void {
        if ( requestStruct.status === status ) return;
        requestStruct.status = status;
        this.requestOnStatus( requestStruct );
    }



    //
    // PENDING
    //

    protected requestPendingAdd( requestStruct: NetworkRequestStructType ): void {
        this.model.queuePending.push( requestStruct );
    }
    protected requestPendingRemove( requestStruct: NetworkRequestStructType ): void {
        while ( true ) {
            const index = this.model.queuePending.findIndex( struct => struct === requestStruct );
            if ( index === -1 ) break;
            this.model.queuePending.splice( index, 1 );
        }
    }

    protected requestPendingAll(): void {
        if ( this.model.queuePending.length <= 0 ) return;

        const requestStructStartList = this.model.queuePending.filter( struct => struct.status === NetworkRequestStatusEnum.CREATE );

        while ( requestStructStartList.length > 0 ) {
            const struct = requestStructStartList.shift();
            if ( !struct ) continue;
            this.requestStatus( struct, NetworkRequestStatusEnum.PENDING );
            this.requestPendingToSend( struct );
        }
    }

    protected requestPendingToSend( requestStruct: NetworkRequestStructType ): void {
        if ( !this.component.isConnected ) return;

        // Just PENDING requests can be sent
        if ( requestStruct.status !== NetworkRequestStatusEnum.PENDING ) {
            debugger;
            output.warn( this.component, `Request ${ requestStruct.id } is not pending and cannot be sent` );
            return;
        }

        requestStruct.timeout = this.requestPendingTimeoutCreate( requestStruct );

        this.requestSend( requestStruct );
    }

    protected requestPendingTimeoutCreate( requestStruct: NetworkRequestStructType ): NodeJS.Timeout {
        // return setTimeout( this.requestSendTimeout.bind( this ), this.timeout, requestStruct );
        const timeoutName = `REQUEST_TIMEOUT_${ requestStruct.id }`;
        return this.timeoutManager.set( timeoutName, this.requestSendTimeout.bind( this ), this.timeout, requestStruct );
    }
    protected requestTimeoutClear( requestStruct: NetworkRequestStructType ): void {
        // if ( !requestStruct.timeout ) return;
        // clearTimeout( requestStruct.timeout );
        // requestStruct.timeout = undefined;
        const timeoutName = `REQUEST_TIMEOUT_${ requestStruct.id }`;
        this.timeoutManager.clear( timeoutName );
    }



    //
    // RETRY
    //

    protected requestRetry( requestStruct: NetworkRequestStructType ): boolean {
        if ( requestStruct.retry <= 0 ) return false;

        requestStruct.retry -= 1;
        this.requestStatus( requestStruct, NetworkRequestStatusEnum.RETRY );
        requestStruct.timeout = this.requestRetryTimeoutCreate( requestStruct );

        return true;
    }
    protected requestRetryToPending( requestStruct: NetworkRequestStructType ): void {
        this.requestTimeoutClear( requestStruct );
        this.requestStatus( requestStruct, NetworkRequestStatusEnum.PENDING );
        this.requestPendingToSend( requestStruct );
    }

    protected requestRetryTimeoutCreate( requestStruct: NetworkRequestStructType ): NodeJS.Timeout {
        // return setTimeout( this.requestRetryToPending.bind( this ), this.retryDelay, requestStruct );
        const timeoutName = `REQUEST_TIMEOUT_${ requestStruct.id }`;
        return this.timeoutManager.set( timeoutName, this.requestRetryToPending.bind( this ), this.retryDelay, requestStruct );

    }



    //
    // SEND
    //

    protected requestSend( requestStruct: NetworkRequestStructType ): void {
        output.log( this.component, `Sending request NO REALISATION ${ requestStruct.id }:`, requestStruct );
    }

    protected requestSendStart( requestStruct: NetworkRequestStructType ): void {
        this.requestStatus( requestStruct, NetworkRequestStatusEnum.PROGRESS );
    }

    protected requestSendProgress( requestStruct: NetworkRequestStructType ): void {
        if ( requestStruct.status !== NetworkRequestStatusEnum.PROGRESS ) return;
        this.requestOn( requestStruct );
    }

    protected requestSendSuccess( requestStruct: NetworkRequestStructType, response: any ): void {
        this.requestTimeoutClear( requestStruct );

        requestStruct.status = NetworkRequestStatusEnum.SUCCESS;

        // Handle methods
        this.requestConnectorUnitClear( requestStruct );
        this.requestPendingRemove( requestStruct );
        this.requestOn( requestStruct );

        this.requestNext();
    }

    protected requestSendError( requestStruct: NetworkRequestStructType, error: Error ): void {
        this.requestTimeoutClear( requestStruct );

        if ( this.requestRetry( requestStruct ) ) return;
        
        requestStruct.status = NetworkRequestStatusEnum.ERROR;
        requestStruct.error = error;

        // Handle methods
        this.requestConnectorUnitClear( requestStruct );
        this.requestPendingRemove( requestStruct );
        this.requestOn( requestStruct );
        
        output.warn( this.component, `Request ${ requestStruct.id } failed:`, requestStruct, error );

        // Next request
        this.requestNext();
    }

    /**
     * Stop pending by TIMEOUT. Timeout not handle retry
     * @param { NetworkRequestStructType } requestStruct 
     */
    protected requestSendTimeout( requestStruct: NetworkRequestStructType ): void {
        this.requestTimeoutClear( requestStruct );
        
        requestStruct.status = NetworkRequestStatusEnum.TIMEOUT;

        // Handle methods
        this.requestConnectorUnitClear( requestStruct );
        this.requestPendingRemove( requestStruct );
        this.requestOn( requestStruct );
        
        output.warn( this.component, `Request ${ requestStruct.id } timed out:`, requestStruct );

        // Next request
        this.requestNext();
    }



    //
    // RESULT
    //

    protected requestOn( requestStruct: NetworkRequestStructType ): void {
        const { status, error } = requestStruct;

        if ( status === NetworkRequestStatusEnum.PROGRESS ) {
            this.requestOnProgress( requestStruct );
        }

        if ( status === NetworkRequestStatusEnum.ERROR || status === NetworkRequestStatusEnum.TIMEOUT ) {
            this.requestOnStatus( requestStruct );
            this.requestOnError( requestStruct, error );
        }

        if ( status === NetworkRequestStatusEnum.SUCCESS ) {
            this.requestOnStatus( requestStruct );
            this.requestOnSuccess( requestStruct );
        }
    }

    protected requestOnStatus( requestStruct: NetworkRequestStructType ): void {
        const { status, request } = requestStruct;
        console.log( `Request ${ requestStruct.id } status:`, status );
        request.handlers?.onStatus?.( status );
    }

    protected requestOnProgress( requestStruct: NetworkRequestStructType ): void {
        const { status, request } = requestStruct;
        if ( status !== NetworkRequestStatusEnum.PROGRESS ) return;
        request.handlers?.onProgress?.( request );
    }

    protected requestOnSuccess( requestStruct: NetworkRequestStructType ): void {
        const { status, request } = requestStruct;
        if ( status !== NetworkRequestStatusEnum.SUCCESS ) return;
        request.handlers?.onSuccess?.( request );
    }

    protected requestOnError( requestStruct: NetworkRequestStructType, error?: Error ): void {
        const { status, request } = requestStruct;
        if ( status !== NetworkRequestStatusEnum.ERROR && status !== NetworkRequestStatusEnum.TIMEOUT ) return;
        request.handlers?.onError?.( request, error );
    }





    //
    // REQUEST STRUCT
    //

    protected requestStructGet( request: NetworkRequestType ): NetworkRequestStructType {
        // Get data from request
        const data = request.data || {};

        // Add unique ID to request for tracking
        const id = this.requestUnique.next();

        // URL stringify
        const url = this.requestStructURLGet( request );

        // Headers for request
        const headers = this.requestStructHeadersGet( request );

        // HTTP method @NetworkRequestMethodEnum
        const method = this.requestStructMethodGet( request );

        // Priority { number }
        const priority = this.requestStructPriorityGet( request );

        // Status
        const status = NetworkRequestStatusEnum.CREATE;

        // Progress
        const progress = 0;

        // Retry
        const retry = this.retry;
        const retryDelay = this.retryDelay;

        // Connector Unit
        const connectorUnit = this.requestConnectorUnitGet();

        return { id, status, request, url, priority, method, headers, progress, data, retry, retryDelay, connectorUnit };
    }

    protected requestStructURLGet( request?: NetworkRequestType ): string {
        let protocol = this.requestStructProtocolGet();
        let host = this.server.host;
        let port = this.server.port ? `:${ this.server.port }` : "";
        let endpoint = request?.endpoint || "";
        if ( endpoint && !endpoint.startsWith( "/" ) ) endpoint = `/${ endpoint }`;

        return `${ protocol }://${ host }${ port }${ endpoint }`;
    }

    protected requestStructProtocolGet(): string {
        switch ( this.server.protocol ) {
            case NetworkProtocolEnum.WS: return "ws";
            case NetworkProtocolEnum.WSS: return "wss";
            case NetworkProtocolEnum.HTTPS: return "https";
            default: return "http";
        }
    }

    protected requestStructPriorityGet( request: NetworkRequestType ): number {
        return request.options?.priority || 0;
    }

    protected requestStructMethodGet( request: NetworkRequestType ): NetworkRequestMethodEnum {
        return request.options?.method || this.model.connection.method || NetworkRequestMethodEnum.GET;
    }

    protected requestStructHeadersGet( request: NetworkRequestType ): Record< string, string > {
        const serverHeaders = this.model.headers || {};
        const requestHeaders = request.options?.headers || {};
        return { ...requestHeaders, ...serverHeaders };
    }



    //
    // HEALTH
    //

    protected healthTimeoutDelay = 5000;

    protected async healthCheck(): Promise< void > {
        if ( !this.model.health ) return Promise.resolve();

        const request: NetworkRequestType | undefined = this.model.health.request;
        if ( !request ) return Promise.resolve();

        request.handlers = {
            onSuccess: this.healthOnSuccess.bind( this ),
            onError: this.healthOnError.bind( this ),
        };

        return this.promiseManager.create( HEALTH_CHECK, () => this.request( request ) );
    }

    protected healthPromiseResolve(): void {
        this.promiseManager.resolve( HEALTH_CHECK );
    }

    protected healthOnSuccess(): void {
        this.healthTimeoutClear();
        this.healthPromiseResolve();

        if ( this.model.health?.test ) return;
        if ( !this.model.health?.heartbeatInterval || this.model.health.heartbeatInterval <= 999 ) return;

        this.healthHeartbeatStart();
    }

    protected healthOnError(): void {
        this.healthTimeoutSet( this.healthCheck.bind( this ), this.healthTimeoutDelay );
    }

    protected healthHeartbeatStart(): void {
        if ( this.timeoutManager.get( HEALTH_CHECK_TIMEOUT ) ) return;

        this.healthTimeoutSet( this.healthCheck.bind( this ), this.model.health?.heartbeatInterval || this.healthTimeoutDelay );
    }

    protected healthTimeoutSet( method: Function, delay: number ): void {
        this.healthTimeoutClear();
        this.timeoutManager.set( HEALTH_CHECK_TIMEOUT, method, delay );
    }

    protected healthTimeoutClear(): void {
        this.timeoutManager.clear( HEALTH_CHECK_TIMEOUT );
    }



    //
    // CONNECTOR UNIT
    //

    protected requestConnectorUnitGet(): any {
        return null;
    }
    protected requestConnectorUnitClear( requestStruct: NetworkRequestStructType ): void {
        // Clear connector unit (e.g. abort XMLHttpRequest or close WebSocket)
    }

}
