import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemComponent, ISystemController, ISystemModel, ISystemView } from "../interface";
export declare class Controller extends BaseController implements ISystemController {
    protected component: ISystemComponent;
    protected model: ISystemModel;
    protected view: ISystemView;
    constructor(component: ISystemComponent, model: ISystemModel, view: ISystemView);
    onStart(): Promise<void>;
    protected subscribeToSystemEvents(): void;
    onModelChange(key: string, value: any): void;
}
