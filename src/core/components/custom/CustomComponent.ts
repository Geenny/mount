import { StreamSubscribeComponent } from "../subscribe/StreamSubscribeComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";

export class CustomComponent extends StreamSubscribeComponent {

    protected classes = {
        Controller: Controller,
        Model: Model,
        View: View
    };
    
}