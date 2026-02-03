import { BaseWorker } from "core/base/BaseWorker";
import { IController, IView } from "./interface";

export class BaseView extends BaseWorker implements IView {

    protected controller?: IController;

    controllerSet( controller: IController ): void {
        this.controller = controller;
    }

    protected onEvent( eventName: string, ...args: any[] ): void {
        this.controller?.onViewEvent( eventName, ...args );
    }
    
}