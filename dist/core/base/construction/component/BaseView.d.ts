import { BaseWorker } from "core/base/BaseWorker";
import { IController, IView } from "./interface";
export declare class BaseView extends BaseWorker implements IView {
    protected controller?: IController;
    controllerSet(controller: IController): void;
    protected onEvent(eventName: string, ...args: any[]): void;
}
