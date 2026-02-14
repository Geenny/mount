import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { ISystemVisibilityComponent, ISystemVisibilityController, ISystemVisibilityModel, ISystemVisibilityView } from "./interface";

export class SystemVisibilityComponent extends StreamSubscribeComponent implements ISystemVisibilityComponent {

    protected controller?: ISystemVisibilityController;
    protected model?: ISystemVisibilityModel;
    protected view?: ISystemVisibilityView;

    protected classes = {
        Controller: Controller,
        Model: Model,
        View: View
    };

}
