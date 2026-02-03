import { BaseView } from "core/base/construction/component/BaseView";
import { Subject } from "rxjs";
import { IStreamView } from "../interface";
import { SubscribeEvent } from "core/base/construction/subscription/types";
import { BaseSubscription } from "core/base/construction/subscription/BaseSubscription";
import { StreamInstanceStruct } from "../types";

export class View extends BaseView implements IStreamView {

    protected instances: BaseSubscription[] = [];
    protected events: Map<SubscribeEvent, StreamInstanceStruct[]> = new Map();

    private list: Map<SubscribeEvent, Subject<any>> = new Map();

    subjectGet( type: SubscribeEvent ): Subject<any> {
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

    isExist( instance: BaseSubscription ): boolean {
        return this.instances.indexOf( instance ) >= 0;
    }

    add( instance: BaseSubscription ): void {
        if ( this.instances.indexOf( instance ) >= 0 ) return;

        this.instances.push( instance );
    }

    remove( instance: BaseSubscription ): void {
        const index = this.instances.indexOf( instance );
        if ( index < 0 ) return;

        this.instances.splice( index, 1 );
    }


    byEventGet( event: SubscribeEvent ): StreamInstanceStruct[] {
        const list = this.events.get( event ) || [];
        return list;
    }

    subscribe( instance: BaseSubscription, event: SubscribeEvent, method: Function ): void {
        let list = this.events.get( event );

        if ( !list ) {
            list = [];
            this.events.set( event, list );
        }

        list.push( { instance, event, method } );
    }
    unsubscribe( instance: BaseSubscription, event: SubscribeEvent, method: Function ): void {
        const list = this.events.get( event );
        if ( !list ) return;

        const filteredList = list.filter( item => item.instance !== instance || item.method !== method );
        this.events.set( event, filteredList );
    }

}