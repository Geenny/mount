import { BaseWorker } from "core/base/BaseWorker";
import { SubscribeMessageData } from "./types";
import { SubscribeActionEnum, SubscribeTypeEnum } from "./enum";
export declare abstract class BaseRecipient extends BaseWorker {
    subscriberMap: Map<string, BaseRecipient>;
    subscriberSet(componentName: string, subscription: BaseRecipient): void;
    onMessage(type: SubscribeTypeEnum, action: SubscribeActionEnum, data: SubscribeMessageData): void;
    protected message(type: SubscribeTypeEnum, action: SubscribeActionEnum, data: SubscribeMessageData): void;
    protected onDestroy(): Promise<void>;
}
