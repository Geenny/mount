import { BaseView } from "core/base/construction/component/BaseView";
import { Subject } from "rxjs";
import { IStreamView } from "../interface";
import { SubscribeEvent } from "core/base/construction/subscription/types";
import { BaseRecipient } from "core/base/construction/subscription/BaseRecipient";
import { StreamInstanceStruct } from "../types";
export declare class View extends BaseView implements IStreamView {
    protected instances: BaseRecipient[];
    protected events: Map<SubscribeEvent, StreamInstanceStruct[]>;
    private list;
    subjectGet(type: SubscribeEvent): Subject<any>;
    isExist(instance: BaseRecipient): boolean;
    add(instance: BaseRecipient): void;
    remove(instance: BaseRecipient): void;
    byEventGet(event: SubscribeEvent): StreamInstanceStruct[];
    subscribe(instance: BaseRecipient, event: SubscribeEvent, method: Function): void;
    unsubscribe(instance: BaseRecipient, event: SubscribeEvent, method: Function): void;
}
