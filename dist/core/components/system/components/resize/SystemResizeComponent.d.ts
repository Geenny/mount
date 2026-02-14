import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { ISystemResizeComponent, ISystemResizeController, ISystemResizeModel, ISystemResizeView } from "./interface";
export declare class SystemResizeComponent extends StreamSubscribeComponent implements ISystemResizeComponent {
    protected controller?: ISystemResizeController;
    protected model?: ISystemResizeModel;
    protected view?: ISystemResizeView;
    protected classes: {
        Controller: typeof Controller;
        Model: typeof Model;
        View: typeof View;
    };
}
