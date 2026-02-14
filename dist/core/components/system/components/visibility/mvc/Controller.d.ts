import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemVisibilityComponent, ISystemVisibilityController, ISystemVisibilityModel, ISystemVisibilityView } from "../interface";
export declare class Controller extends BaseController implements ISystemVisibilityController {
    protected component: ISystemVisibilityComponent;
    protected model: ISystemVisibilityModel;
    protected view: ISystemVisibilityView;
    constructor(component: ISystemVisibilityComponent, model: ISystemVisibilityModel, view: ISystemVisibilityView);
    onStart(): Promise<void>;
    protected systemVisible(): void;
}
