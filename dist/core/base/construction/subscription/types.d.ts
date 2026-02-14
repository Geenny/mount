import { BaseSubscription } from "./BaseSubscription";
type SubscribeEvent = string | symbol;
type SubscribeData = Record<string, any>;
type SubscribeSource = {
    event: SubscribeEvent;
    data?: SubscribeData;
    method?: Function;
};
type SubscribeMessageData = {
    instance: BaseSubscription;
    source?: SubscribeSource;
};
export { SubscribeEvent, SubscribeData, SubscribeMessageData, SubscribeSource };
