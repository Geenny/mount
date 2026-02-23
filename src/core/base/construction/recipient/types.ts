import { BaseRecipient } from "./BaseRecipient";

type RecipientEvent = string | symbol;

type RecipientData = Record<string, any>;

type RecipientSource = { event: RecipientEvent, data?: RecipientData, method?: Function };

type RecipientMessageData = {
    instance: BaseRecipient,
    source?: RecipientSource
};

export { RecipientEvent, RecipientData, RecipientMessageData, RecipientSource };