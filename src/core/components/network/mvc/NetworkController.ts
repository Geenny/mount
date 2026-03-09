import { BaseController } from "core/base/construction/component/BaseController";
import { IView } from "core/base/construction/component/interface";
import { INetworkComponent, INetworkConnector, INetworkController, INetworkModel } from "../interface";
import { NETWORK_EVENT } from "core/constants";
import { NetworkConnectionRequest, NetworkResponseType, NetworkErrorType, NetworkRequestType } from "../types";
import { NetworkRequestStatusEnum, NetworkRequestMethodEnum } from "../enums";
import { Storage } from "utils/storage/Storage";
import { output } from "utils/index";
import { NetworkConnectorComponent } from "../components/connector/NetworkConnectorComponent";
import { RecipientActionEnum, RecipientTypeEnum } from "core/base/construction/recipient/enum";
import { RecipientMessageData, RecipientSource } from "core/base/construction/recipient/types";
import { NetworkComponent } from "../NetworkComponent";

/**
 * Network component controller
 * Manages request queues, caching, and routing to connector components
 */
export class Controller extends BaseController implements INetworkController {
    
    protected component: INetworkComponent;
    protected model: INetworkModel;
    
    constructor( component: INetworkComponent, model: INetworkModel, view: IView ) {
        super( component, model, view );
        
        this.component = component;
        this.model = model;
    }



    //
    // LIFECYCLE
    //
    async onStart(): Promise< void > {
        await super.onStart();

        this.subscriptions();
    }

    async onStop(): Promise< void > {
        await super.onStop();

        this.unsubscrictions();
    }


    //
    // SUBSCRIPTIONS
    //
    private methods?: MethodSend;

    protected subscriptions(): void {
        if ( this.methods ) return;

        this.methods = { onSend: this.onSend.bind( this ) };

        // Subscribe to network requests from application
        this.subscribe( NETWORK_EVENT.SEND, this.methods.onSend );
    }
    protected unsubscrictions(): void {
        if ( !this.methods ) return;
        
        this.unsubscribe( NETWORK_EVENT.SEND, this.methods.onSend );

        this.methods = undefined;
    }


    //
    // SEND
    //

    protected onSend( request: NetworkRequestType ): void {
        output.log( this.component, request );

        const connector = this.connectorGet( request ) as NetworkConnectorComponent | undefined;
        if ( !connector ) return;

        this.connectorRequestSend( connector, request );
    }


    //
    // CONNECTOR ROUTING
    //

    protected connectorGet( request: NetworkRequestType ): INetworkConnector | undefined {
        const connector = this.component.connectorGet( request );
        if ( !connector ) {
            output.error( this.component, `No connector found for request:`, request );
            return;
        }
        return connector;
    }

    protected connectorRequestSend( connector: NetworkConnectorComponent, request: NetworkRequestType ): void {
        const instance = this.component as NetworkComponent;
        const source: RecipientSource = { event: "send", data: request };
        const data: RecipientMessageData = { instance, source };

        connector.onMessage( RecipientTypeEnum.DATA, RecipientActionEnum.START, data );
    }

}

type MethodSend = { onSend: Function };