import { BaseRecipient } from "core/base/construction/subscription/BaseRecipient";
import { SubscribeEvent } from "core/base/construction/subscription/types";
type StreamInstanceStruct = {
    instance: BaseRecipient;
    event: SubscribeEvent;
    method: Function;
};
export { StreamInstanceStruct };
