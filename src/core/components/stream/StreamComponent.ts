import { BaseComponent } from "core/base/construction/component/BaseComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { IStreamComponent, IStreamController, IStreamModel, IStreamView } from "./interface";
import { RecipientActionEnum, RecipientTypeEnum } from "core/base/construction/recipient/enum";
import { RecipientEvent, RecipientMessageData } from "core/base/construction/recipient/types";
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

    onMessage( type: RecipientTypeEnum, action: RecipientActionEnum, data: RecipientMessageData ): void {
        if ( data.instance && data.instance === this ) {
            output.error( this, 'StreamComponent: Cannot send message to self!' );
            return;
        }

        switch ( type ) {

            case RecipientTypeEnum.SYSTEM:
                this.handleSystemMessage( action, data );
                break;
            
            case RecipientTypeEnum.SUBSCRIBE:
                this.handleSubscribeMessage( action, data );
                break;

            case RecipientTypeEnum.DATA:
                this.handleDataMessage( action, data );
                break;
            
        }
    }

    protected handleSystemMessage( action: RecipientActionEnum, messageData: RecipientMessageData ): void {
        const { instance } = messageData;

        switch ( action ) {

            case RecipientActionEnum.START:
                this.controller?.instanceAdd( instance );
                break;

            case RecipientActionEnum.STOP:
                this.controller?.instanceRemove( instance );
                break;
            
        }
    }

    protected handleSubscribeMessage( action: RecipientActionEnum, messageData: RecipientMessageData ): void {
        const { instance, source } = messageData;

        if ( !source ) return;
        const { event, method } = source;

        if ( !event || !method ) return;
        if ( !this.controller ) return;

        switch ( action ) {

            case RecipientActionEnum.START:
                this.controller.stream( instance, event, method );
                break;

            case RecipientActionEnum.STOP:
                this.controller.unstream( instance, event, method );
                break;
            
        }
    }

    protected handleDataMessage( action: RecipientActionEnum, messageData: RecipientMessageData ): void {
        const { source } = messageData;

        if ( !source ) return;
        const { event, data } = source;

        this.controller?.emit( event, data);
    }

}