import { BaseWorker } from "core/base/BaseWorker";
import { SubscribeEvent, SubscribeMessageData } from "./types";
import { ComponentNameEnum } from "core/component/enums";
import { SubscribeActionEnum, SubscribeTypeEnum } from "./enum";

export abstract class BaseSubscription extends BaseWorker {

    subscriberMap: Map<ComponentNameEnum, BaseSubscription> = new Map();



    //
    // SUBSCRIBERS
    //

    subscriberSet( componentName: ComponentNameEnum, subscription: BaseSubscription ): void {
        this.subscriberMap.set( componentName, subscription );
    }



    //
    // MESSAGING
    //

    onMessage( type: SubscribeTypeEnum, action: SubscribeActionEnum, data: SubscribeMessageData ): void {
        // Override in subclasses
    }

    protected message( type: SubscribeTypeEnum, action: SubscribeActionEnum, data: SubscribeMessageData ): void {
        this.subscriberMap.forEach( ( subscription ) => subscription.onMessage( type, action, data ) );
    }



    //
    // LIFECYCLE
    //

    protected async onDestroy(): Promise<void> {
        await super.onDestroy();

        this.subscriberMap.clear();
    }

}