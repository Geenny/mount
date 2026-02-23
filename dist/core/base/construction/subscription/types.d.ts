import { BaseRecipient } from "./BaseRecipient";
type SubscribeEvent = string | symbol;
type SubscribeData = Record<string, any>;
type SubscribeSource = {
    event: SubscribeEvent;
    data?: SubscribeData;
    method?: Function;
};
type SubscribeMessageData = {
    instance: BaseRecipient;
    source?: SubscribeSource;
};
export { SubscribeEvent, SubscribeData, SubscribeMessageData, SubscribeSource };
