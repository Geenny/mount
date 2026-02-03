import { BaseComponent } from "core/base/construction/component/BaseComponent";
import { SubscribeEventEnum, SubscribeTypeEnum } from "core/base/construction/subscription/enum";
import { SubscribeEvent } from "core/base/construction/subscription/types";
import { IComponent } from "core/base/construction/component/interface";
import { ComponentName } from "../enums";
import { output } from "utils/index";
import { StreamComponent } from "../stream/StreamComponent";

export class StreamSubscribeComponent extends BaseComponent implements IComponent {

    private streamComponent?: StreamComponent;


    // System

    emit( event: SubscribeEvent, data: any ): void {
        if ( !this.streamComponent ) {
            this.streamComponent = this.subscriptions.get( ComponentName.STREAM ) as StreamComponent;

            if ( !this.streamComponent ) {
                output.error( this, 'StreamSubscribeComponent: Stream component not found in subscriptions!' );
                return;
            }
        }

        this.streamComponent.onMessage( SubscribeTypeEnum.DATA, { instance: this, event: SubscribeEventEnum.START, source: { event, data } } );
    }

}