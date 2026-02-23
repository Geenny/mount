import { BaseController } from "core/base/construction/component/BaseController";
import { IStreamComponent, IStreamController, IStreamModel, IStreamView } from "../interface";
import { BaseRecipient } from "core/base/construction/subscription/BaseRecipient";
import { SubscribeEvent } from "core/base/construction/subscription/types";
export declare class Controller extends BaseController implements IStreamController {
    protected component: IStreamComponent;
    protected model: IStreamModel;
    protected view: IStreamView;
    constructor(component: IStreamComponent, model: IStreamModel, view: IStreamView);
    emit(event: SubscribeEvent, data: any): void;
    stream(instance: BaseRecipient, event: SubscribeEvent, method: Function): void;
    unstream(instance: BaseRecipient, event: SubscribeEvent, method: Function): void;
    instanceAdd(instance: BaseRecipient): void;
    instanceRemove(instance: BaseRecipient): void;
}
