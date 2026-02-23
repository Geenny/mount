import { StreamSubscribeComponent } from "../subscribe/StreamSubscribeComponent";
import { ApplicationController } from "./mvc/Controller";
import { ApplicationModel } from "./mvc/Model";
import { ApplicationView } from "./mvc/View";
import { IApplicationComponent, IApplicationController, IApplicationModel, IApplicationView } from "./interface";

export class ApplicationComponent extends StreamSubscribeComponent implements IApplicationComponent {

    protected controller?: IApplicationController;
    protected model?: IApplicationModel;
    protected view?: IApplicationView;

    protected classes = {
        Controller: ApplicationController,
        Model: ApplicationModel,
        View: ApplicationView
    };

    onEvent(event: string, data?: any): void {
        console.log(`ApplicationComponent received event: ${event}`, data);
    }
    
}