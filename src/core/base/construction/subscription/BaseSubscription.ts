import { BaseWorker } from "core/base/BaseWorker";
import { SubscribeEvent } from "./types";

export abstract class BaseSubscription extends BaseWorker {

    subscriptions: Map<string, BaseSubscription> = new Map();

    subscribe( name: string, subscription: BaseSubscription ): void {
        this.subscriptions.set( name , subscription );
    }

    unsubscribe( name: string ): void {
        this.subscriptions.delete( name );
    }

    emit( event: SubscribeEvent, data?: any ): void {
        this.subscriptions.forEach( ( subscription ) => {
            subscription.onEvent( event, data );
        } );
    }

    onEvent( event: SubscribeEvent, data?: any ): void {

    }

}