import { BaseView } from "core/base/construction/component/BaseView";
import { Subject } from "rxjs";
import { IStreamView } from "../interface";
import { RecipientEvent } from "core/base/construction/recipient/types";
import { BaseRecipient } from "core/base/construction/recipient/BaseRecipient";
import { StreamInstanceStruct } from "../types";

export class View extends BaseView implements IStreamView {

    protected instances: BaseRecipient[] = [];
    protected events: Map<RecipientEvent, StreamInstanceStruct[]> = new Map();

    private list: Map<RecipientEvent, Subject<any>> = new Map();

    subjectGet( type: RecipientEvent ): Subject<any> {
        let subject = this.list.get( type );

        if ( !subject ) {
            subject = new Subject<any>();
            this.list.set( type, subject );
        }

        return subject;
    }


    //
    // INSTANCE TARGETs
    //

    isExist( instance: BaseRecipient ): boolean {
        return this.instances.indexOf( instance ) >= 0;
    }

    add( instance: BaseRecipient ): void {
        if ( this.instances.indexOf( instance ) >= 0 ) return;

        this.instances.push( instance );
    }

    remove( instance: BaseRecipient ): void {
        const index = this.instances.indexOf( instance );
        if ( index < 0 ) return;

        this.instances.splice( index, 1 );
    }


    byEventGet( event: RecipientEvent ): StreamInstanceStruct[] {
        const list = this.events.get( event ) || [];
        return list;
    }

    subscribe( instance: BaseRecipient, event: RecipientEvent, method: Function ): void {
        let list = this.events.get( event );

        if ( !list ) {
            list = [];
            this.events.set( event, list );
        }

        list.push( { instance, event, method } );
    }
    unsubscribe( instance: BaseRecipient, event: RecipientEvent, method: Function ): void {
        const list = this.events.get( event );
        if ( !list ) return;

        const filteredList = list.filter( item => item.instance !== instance || item.method !== method );
        this.events.set( event, filteredList );
    }

}