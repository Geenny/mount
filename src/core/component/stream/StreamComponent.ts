import { BaseComponent } from "core/base/construction/component/BaseComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { IStreamComponent, IStreamController, IStreamModel, IStreamView } from "./interface";
import { SubscribeEventEnum, SubscribeTypeEnum } from "core/base/construction/subscription/enum";
import { SubscribeEvent, SubscribeMessageData } from "core/base/construction/subscription/types";
import { output } from "utils/index";

export class StreamComponent extends BaseComponent implements IStreamComponent {

    protected controller?: IStreamController;
    protected model?: IStreamModel;
    protected view?: IStreamView;

    protected classes = {
        Controller: Controller,
        Model: Model,
        View: View
    };



    //
    // MESSAGING
    //

    onMessage( type: SubscribeTypeEnum, data: SubscribeMessageData ): void {
        if ( data.instance && data.instance === this ) {
            output.error( this, 'StreamComponent: Cannot send message to self!' );
            return;
        }

        switch ( type ) {

            case SubscribeTypeEnum.SYSTEM:
                this.handleSystemMessage( data );
                break;
            
            case SubscribeTypeEnum.SUBSCRIBE:
                this.handleSubscribeMessage( data );
                break;

            case SubscribeTypeEnum.DATA:
                this.handleDataMessage( data );
                break;
            
        }
    }

    protected handleSystemMessage( messageData: SubscribeMessageData ): void {
        const { event, instance } = messageData;

        switch ( event ) {

            case SubscribeEventEnum.START:
                this.controller?.instanceAdd( instance );
                break;

            case SubscribeEventEnum.STOP:
                this.controller?.instanceRemove( instance );
                break;
            
        }
    }

    protected handleSubscribeMessage( messageData: SubscribeMessageData ): void {
        const { instance, event, source } = messageData;

        const sourceEvent = source?.event;
        const sourceMethod = source?.method;

        if ( !sourceEvent || !sourceMethod ) return;

        switch ( event ) {

            case SubscribeEventEnum.START:
                this.controller?.subscribe( instance, sourceEvent, sourceMethod );
                break;

            case SubscribeEventEnum.STOP:
                this.controller?.unsubscribe( instance, sourceEvent, sourceMethod );
                break;
            
        }
    }

    protected handleDataMessage( messageData: SubscribeMessageData ): void {
        const { source } = messageData;

        if ( !source ) return;
        const { event, data } = source;

        this.controller?.emit( event, data);
    }

}