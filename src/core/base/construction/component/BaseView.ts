import { BaseWorker } from "core/base/BaseWorker";
import { BaseController } from './BaseController';
import { IControllerHolder } from "./interface";

export class BaseView extends BaseWorker implements IControllerHolder {

    protected controller?: BaseController;

    controllerSet( controller: BaseController ): void {
        this.controller = controller;
    }

    onEvent( eventName: string, ...args: any[] ): void {
        this.controller?.onViewEvent( eventName, ...args );
    }
    
}