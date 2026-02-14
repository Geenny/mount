import { BaseWorker } from "core/base/BaseWorker";
import { IComponent, IController, IModel, IView } from "./interface";
import { SubscribeData, SubscribeEvent } from "../subscription/types";
export declare class BaseController extends BaseWorker implements IController {
    protected component: IComponent;
    protected model: IModel;
    protected view?: IView;
    constructor(component: IComponent, model: IModel, view?: IView);
    onModelChange(key: string, value: any): void;
    onViewEvent(eventName: string, ...args: any[]): void;
    emit(event: SubscribeEvent, data?: SubscribeData): void;
    onEvent(event: SubscribeEvent, data?: SubscribeData): void;
    subscribe(event: SubscribeEvent, method: Function): void;
    unsubscribe(event: SubscribeEvent, method: Function): void;
}
