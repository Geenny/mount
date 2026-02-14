import { BaseSubscription } from "core/base/construction/subscription/BaseSubscription";
import { SubscribeEvent } from "core/base/construction/subscription/types";
type StreamInstanceStruct = {
    instance: BaseSubscription;
    event: SubscribeEvent;
    method: Function;
};
export { StreamInstanceStruct };
