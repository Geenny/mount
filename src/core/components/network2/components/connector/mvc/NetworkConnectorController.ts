import { BaseController } from "core/base/construction/component/BaseController";
import {
    INetworkConnectorController,
    INetworkConnectorModel
} from "../interface";
import { INetworkConnectorComponent } from "../interface";
import { RecipientEvent } from "core/base/construction/recipient/types";
import { NetworkRequestStructType, NetworkRequestType } from "../../../types";
import { Unique } from "utils/unique/Unique";
import { output } from "utils/index";
import { NetworkRequestMethodEnum } from "core/components/network2/enums";

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
    
    /**
     * Start connector - listen to requests
     */
    async onStart(): Promise< void > {
        await super.onStart();

        this.model;

        // this.subscribeToEvents();
        
        // Connect to server (performs health check if configured)
        // await this.connect();
    }
    
    /**
     * Stop connector - disconnect and cleanup
     */
    async onStop(): Promise< void > {
        // await this.disconnect();
    }


    //
    // GETTERS
    //

    get concurrent(): number {
        return this.model?.connection?.concurrent ? this.model.connection.concurrent : 1;
    }



    //
    // EVENTS
    //

    onEvent( event: RecipientEvent, request: NetworkRequestType ): void {
        if ( event !== "send" ) return;

        const requestStruct = this.requestFormat( request );

        this.requestToQueueAdd( requestStruct );

        this.requestNext();
    }


    //
    // REQUEST
    //

    protected requestFormat( request: NetworkRequestType ): NetworkRequestStructType {
        // Add unique ID to request for tracking
        const id = this.requestUnique.next();

        // Params
        request.params = request.params || {};

        // Priority
        request.params.priority = request.params.priority || 0;

        // Method
        request.params.method = request.params.method || this.model.connection.method || NetworkRequestMethodEnum.GET;

        // Headers
        const headers = this.model.headers || {};
        request.params.headers = request.params.headers || {};
        // Merge headers from model and request
        request.params.headers = { ...headers, ...request.params.headers };

        this.model;

        debugger;

        return { id, request };
    }

    protected requestToQueueAdd( requestStruct: NetworkRequestStructType ): void {
        this.model.queue.push( requestStruct );
        this.model.queue.sort( ( a, b ) => (b.request.params?.priority || 0) - (a.request.params?.priority || 0) );
    }

    protected requestNext(): void {

        // No requests in queue
        if ( this.model.queue.length === 0 ) return;

        // Check concurrent limit
        if ( this.model.queuePending.length >= this.concurrent ) return;

        const requestStruct = this.model.queue.shift();
        if ( !requestStruct ) {
            output.warn( this.component, "Failed to retrieve request from queue", requestStruct );
            return;
        }

        this.requestPendingAdd( requestStruct );

        this.requestPendingNext();

        this.requestNext();

    }

    protected requestPendingAdd( requestStruct: NetworkRequestStructType ): void {
        this.model.queuePending.push( requestStruct );
    }

    protected requestPendingNext(): void {
        // Process pending requests (send to server)
    }

}
