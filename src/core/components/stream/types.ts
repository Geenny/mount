import { BaseRecipient } from "core/base/construction/recipient/BaseRecipient";
import { RecipientEvent } from "core/base/construction/recipient/types";

type StreamInstanceStruct = { instance: BaseRecipient, event: RecipientEvent, method: Function };

export { StreamInstanceStruct };