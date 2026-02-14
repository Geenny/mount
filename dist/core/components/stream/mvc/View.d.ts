import { BaseView } from "core/base/construction/component/BaseView";
import { Subject } from "rxjs";
import { IStreamView } from "../interface";
import { SubscribeEvent } from "core/base/construction/subscription/types";
import { BaseSubscription } from "core/base/construction/subscription/BaseSubscription";
import { StreamInstanceStruct } from "../types";
export declare class View extends BaseView implements IStreamView {
    protected instances: BaseSubscription[];
    protected events: Map<SubscribeEvent, StreamInstanceStruct[]>;
    private list;
    subjectGet(type: SubscribeEvent): Subject<any>;
    isExist(instance: BaseSubscription): boolean;
    add(instance: BaseSubscription): void;
    remove(instance: BaseSubscription): void;
    byEventGet(event: SubscribeEvent): StreamInstanceStruct[];
    subscribe(instance: BaseSubscription, event: SubscribeEvent, method: Function): void;
    unsubscribe(instance: BaseSubscription, event: SubscribeEvent, method: Function): void;
}
