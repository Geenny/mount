import { StreamSubscribeComponent } from "core/components/subscribe/StreamSubscribeComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
import { ISystemKeyboardComponent, ISystemKeyboardController, ISystemKeyboardModel, ISystemKeyboardView } from "./interface";

export class SystemKeyboardComponent extends StreamSubscribeComponent implements ISystemKeyboardComponent {

    protected controller?: ISystemKeyboardController;
    protected model?: ISystemKeyboardModel;
    protected view?: ISystemKeyboardView;

    protected classes = {
        Controller: Controller,
        Model: Model,
        View: View
    };

}
