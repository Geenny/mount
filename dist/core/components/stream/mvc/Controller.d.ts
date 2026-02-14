import { BaseController } from "core/base/construction/component/BaseController";
import { IStreamComponent, IStreamController, IStreamModel, IStreamView } from "../interface";
import { BaseSubscription } from "core/base/construction/subscription/BaseSubscription";
import { SubscribeEvent } from "core/base/construction/subscription/types";
export declare class Controller extends BaseController implements IStreamController {
    protected component: IStreamComponent;
    protected model: IStreamModel;
    protected view: IStreamView;
    constructor(component: IStreamComponent, model: IStreamModel, view: IStreamView);
    emit(event: SubscribeEvent, data: any): void;
    stream(instance: BaseSubscription, event: SubscribeEvent, method: Function): void;
    unstream(instance: BaseSubscription, event: SubscribeEvent, method: Function): void;
    instanceAdd(instance: BaseSubscription): void;
    instanceRemove(instance: BaseSubscription): void;
}
