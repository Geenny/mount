import { StreamSubscribeComponent } from "../subscribe/StreamSubscribeComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { ISystemComponent, ISystemController, ISystemModel, ISystemView } from "./interface";
export declare class SystemComponent extends StreamSubscribeComponent implements ISystemComponent {
    protected controller?: ISystemController;
    protected model?: ISystemModel;
    protected view?: ISystemView;
    protected classes: {
        Controller: typeof Controller;
        Model: typeof Model;
        View: typeof View;
    };
}
