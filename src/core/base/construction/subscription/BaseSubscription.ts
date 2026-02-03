import { BaseWorker } from "core/base/BaseWorker";
import { SubscribeEvent, SubscribeMessageData } from "./types";
import { ComponentName } from "core/component/enums";
import { SubscribeEventEnum, SubscribeTypeEnum } from "./enum";

export abstract class BaseSubscription extends BaseWorker {

    subscriptions: Map<ComponentName, BaseSubscription> = new Map();



    //
    // SUBSCRIPTION
    //

    subscribe( componentName: ComponentName, subscription: BaseSubscription ): void {
        this.subscriptions.set( componentName, subscription );
    }

    unsubscribe( componentName: ComponentName ): void {
        this.subscriptions.delete( componentName );
    }


    //
    // EVENTS
    //

    emit( event: SubscribeEvent, data?: any ): void { }

    onEvent( event: SubscribeEvent, data?: any ): void { }



    //
    // MESSAGING
    //

    onMessage( type: SubscribeTypeEnum, data: SubscribeMessageData ): void {
        // Override in subclasses
    }

    protected message( type: SubscribeTypeEnum, data: SubscribeMessageData ): void {
        this.subscriptions.forEach( ( subscription ) => subscription.onMessage( type, data ) );
    }



    //
    // LIFECYCLE
    //

    protected async onDestroy(): Promise<void> {
        await super.onDestroy();

        this.subscriptions.clear();
    }

}