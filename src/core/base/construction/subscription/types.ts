import { BaseSubscription } from "./BaseSubscription";

type SubscribeEvent = string | symbol;

type SubscribeSource = { event: SubscribeEvent, data?: any, method?: Function };

type SubscribeMessageData = {
    instance: BaseSubscription,
    source?: SubscribeSource
};

export { SubscribeEvent, SubscribeMessageData, SubscribeSource };