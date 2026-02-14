import { BaseController } from "core/base/construction/component/BaseController";
import { IApplicationComponent, IApplicationController, IApplicationModel, IApplicationView } from "../interface";
export declare class Controller extends BaseController implements IApplicationController {
    protected component: IApplicationComponent;
    protected model: IApplicationModel;
    protected view: IApplicationView;
    constructor(component: IApplicationComponent, model: IApplicationModel, view: IApplicationView);
    onStart(): Promise<void>;
}
