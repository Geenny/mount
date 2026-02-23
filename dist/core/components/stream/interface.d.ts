import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { BaseRecipient } from "core/base/construction/subscription/BaseRecipient";
import { SubscribeEvent } from "core/base/construction/subscription/types";
import { StreamInstanceStruct } from "./types";
interface IStreamComponent extends IComponent {
}
interface IStreamModel extends IModel {
}
interface IStreamView extends IView {
    isExist(instance: BaseRecipient): boolean;
    add(instance: BaseRecipient): void;
    remove(instance: BaseRecipient): void;
    byEventGet(event: SubscribeEvent): StreamInstanceStruct[];
    subscribe(instance: BaseRecipient, event: SubscribeEvent, method: Function): void;
    unsubscribe(instance: BaseRecipient, event: SubscribeEvent, method: Function): void;
}
interface IStreamController extends IController {
    instanceAdd(instance: BaseRecipient): void;
    instanceRemove(instance: BaseRecipient): void;
    emit(event: SubscribeEvent, data: any): void;
    stream(instance: BaseRecipient, event: SubscribeEvent, method: Function): void;
    unstream(instance: BaseRecipient, event: SubscribeEvent, method: Function): void;
}
export { IStreamComponent, IStreamModel, IStreamView, IStreamController };
