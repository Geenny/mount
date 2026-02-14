import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemResizeComponent, ISystemResizeController, ISystemResizeModel, ISystemResizeView } from "../interface";
export declare class Controller extends BaseController implements ISystemResizeController {
    protected component: ISystemResizeComponent;
    protected model: ISystemResizeModel;
    protected view: ISystemResizeView;
    constructor(component: ISystemResizeComponent, model: ISystemResizeModel, view: ISystemResizeView);
    onStart(): Promise<void>;
    protected systemResize(): void;
}
