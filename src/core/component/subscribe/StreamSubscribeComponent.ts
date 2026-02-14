import { BaseComponent } from "core/base/construction/component/BaseComponent";
import { SubscribeTypeEnum, SubscribeActionEnum } from "core/base/construction/subscription/enum";
import { SubscribeEvent } from "core/base/construction/subscription/types";
import { IComponent } from "core/base/construction/component/interface";
import { ComponentNameEnum } from "../enums";
import { output } from "utils/index";
import { StreamComponent } from "../stream/StreamComponent";

export class StreamSubscribeComponent extends BaseComponent implements IComponent {

    private streamComponent?: StreamComponent;


    // System

    // emit( event: SubscribeEvent, data?: any ): void {
    //     const messageData = { instance: this, event: SubscribeEventEnum.START, source: { event, data } };
    //     this.message( SubscribeTypeEnum.DATA, messageData );
    // }
    emit( event: SubscribeEvent, data: any ): void {
        if ( !this.streamComponent ) {
            const component = this.subscriberMap.get( ComponentNameEnum.STREAM );
            if ( !component ) {
                output.error( this, 'StreamSubscribeComponent: Stream component not found in subscriptions!' );
                return;
            }

            if ( !( component instanceof StreamComponent ) ) {
                output.error( this, 'StreamSubscribeComponent: Stream component is not an instance of StreamComponent!' );
                return;
            }

            this.streamComponent = component as StreamComponent;
        }

        this.streamComponent.onMessage( SubscribeTypeEnum.DATA, SubscribeActionEnum.START, { instance: this, source: { event, data } } );
    }

}