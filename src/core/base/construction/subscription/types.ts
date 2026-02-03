import { BaseSubscription } from "./BaseSubscription";
import { SubscribeEventEnum } from "./enum";

type SubscribeEvent = string | symbol;

type SubscribeSource = { event: SubscribeEvent, data?: any, method?: Function };

type SubscribeMessageData = {
    instance: BaseSubscription,
    event: SubscribeEventEnum,
    source?: SubscribeSource
};

export { SubscribeEvent, SubscribeMessageData, SubscribeSource };