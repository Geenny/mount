import { StreamSubscribeComponent } from "../subscribe/StreamSubscribeComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { IApplicationComponent, IApplicationController, IApplicationModel, IApplicationView } from "./interface";
export declare class ApplicationComponent extends StreamSubscribeComponent implements IApplicationComponent {
    protected controller?: IApplicationController;
    protected model?: IApplicationModel;
    protected view?: IApplicationView;
    protected classes: {
        Controller: typeof Controller;
        Model: typeof Model;
        View: typeof View;
    };
    onEvent(event: string, data?: any): void;
}
