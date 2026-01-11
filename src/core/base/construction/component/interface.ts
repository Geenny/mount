import { BaseController } from "./BaseController";

interface IControllerHolder {

    controllerSet( controller: BaseController ): void;

}

export { IControllerHolder };