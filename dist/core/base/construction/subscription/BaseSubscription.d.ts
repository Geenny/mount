import { BaseWorker } from "core/base/BaseWorker";
import { SubscribeMessageData } from "./types";
import { SubscribeActionEnum, SubscribeTypeEnum } from "./enum";
export declare abstract class BaseSubscription extends BaseWorker {
    subscriberMap: Map<string, BaseSubscription>;
    subscriberSet(componentName: string, subscription: BaseSubscription): void;
    onMessage(type: SubscribeTypeEnum, action: SubscribeActionEnum, data: SubscribeMessageData): void;
    protected message(type: SubscribeTypeEnum, action: SubscribeActionEnum, data: SubscribeMessageData): void;
    protected onDestroy(): Promise<void>;
}
