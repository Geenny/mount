import { BaseComponent } from "core/base/construction/component/BaseComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { IStreamComponent, IStreamController, IStreamModel, IStreamView } from "./interface";
import { SubscribeActionEnum, SubscribeTypeEnum } from "core/base/construction/subscription/enum";
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

    onMessage( type: SubscribeTypeEnum, action: SubscribeActionEnum, data: SubscribeMessageData ): void {
        if ( data.instance && data.instance === this ) {
            output.error( this, 'StreamComponent: Cannot send message to self!' );
            return;
        }

        switch ( type ) {

            case SubscribeTypeEnum.SYSTEM:
                this.handleSystemMessage( action, data );
                break;
            
            case SubscribeTypeEnum.SUBSCRIBE:
                this.handleSubscribeMessage( action, data );
                break;

            case SubscribeTypeEnum.DATA:
                this.handleDataMessage( action, data );
                break;
            
        }
    }

    protected handleSystemMessage( action: SubscribeActionEnum, messageData: SubscribeMessageData ): void {
        const { instance } = messageData;

        switch ( action ) {

            case SubscribeActionEnum.START:
                this.controller?.instanceAdd( instance );
                break;

            case SubscribeActionEnum.STOP:
                this.controller?.instanceRemove( instance );
                break;
            
        }
    }

    protected handleSubscribeMessage( action: SubscribeActionEnum, messageData: SubscribeMessageData ): void {
        const { instance, source } = messageData;

        if ( !source ) return;
        const { event, method } = source;

        if ( !event || !method ) return;
        if ( !this.controller ) return;

        switch ( action ) {

            case SubscribeActionEnum.START:
                this.controller.stream( instance, event, method );
                break;

            case SubscribeActionEnum.STOP:
                this.controller.unstream( instance, event, method );
                break;
            
        }
    }

    protected handleDataMessage( action: SubscribeActionEnum, messageData: SubscribeMessageData ): void {
        const { source } = messageData;

        if ( !source ) return;
        const { event, data } = source;

        this.controller?.emit( event, data);
    }

}