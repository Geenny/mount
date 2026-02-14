import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { BaseSubscription } from "core/base/construction/subscription/BaseSubscription";
import { SubscribeEvent } from "core/base/construction/subscription/types";
import { StreamInstanceStruct } from "./types";
interface IStreamComponent extends IComponent {
}
interface IStreamModel extends IModel {
}
interface IStreamView extends IView {
    isExist(instance: BaseSubscription): boolean;
    add(instance: BaseSubscription): void;
    remove(instance: BaseSubscription): void;
    byEventGet(event: SubscribeEvent): StreamInstanceStruct[];
    subscribe(instance: BaseSubscription, event: SubscribeEvent, method: Function): void;
    unsubscribe(instance: BaseSubscription, event: SubscribeEvent, method: Function): void;
}
interface IStreamController extends IController {
    instanceAdd(instance: BaseSubscription): void;
    instanceRemove(instance: BaseSubscription): void;
    emit(event: SubscribeEvent, data: any): void;
    stream(instance: BaseSubscription, event: SubscribeEvent, method: Function): void;
    unstream(instance: BaseSubscription, event: SubscribeEvent, method: Function): void;
}
export { IStreamComponent, IStreamModel, IStreamView, IStreamController };
