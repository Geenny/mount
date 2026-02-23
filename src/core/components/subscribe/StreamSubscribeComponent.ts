import { BaseComponent } from "core/base/construction/component/BaseComponent";
import { RecipientTypeEnum, RecipientActionEnum } from "core/base/construction/recipient/enum";
import { RecipientEvent } from "core/base/construction/recipient/types";
import { IComponent } from "core/base/construction/component/interface";
import { ComponentNameEnum } from "../enums";
import { StreamComponent } from "../stream/StreamComponent";
import { output } from "utils/index";

export class StreamSubscribeComponent extends BaseComponent implements IComponent {

    private streamComponent?: StreamComponent;

    private streamComponentDefine(): void {
        if ( this.streamComponent ) return;

        const component = this.recipientGet( ComponentNameEnum.STREAM );
        if ( !component ) {
            output.error( this, `${ this.name }: Stream component not found in Recipients!` );
            return;
        }

        if ( !( component instanceof StreamComponent ) ) {
            output.error( this, `${ this.name }: Stream component is not an instance of StreamComponent!` );
            return;
        }

        this.streamComponent = component as StreamComponent;
    }

    /**
     * Emit an event to the StreamComponent
     */
    emit( event: RecipientEvent, data: any ): void {
        if ( !this.streamComponent ) {
            this.streamComponentDefine();
            if ( !this.streamComponent ) return;
        }

        this.streamComponent.onMessage( RecipientTypeEnum.DATA, RecipientActionEnum.START, { instance: this, source: { event, data } } );
    }

}