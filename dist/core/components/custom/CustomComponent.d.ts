import { StreamSubscribeComponent } from "../subscribe/StreamSubscribeComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";
export declare class CustomComponent extends StreamSubscribeComponent {
    protected classes: {
        Controller: typeof Controller;
        Model: typeof Model;
        View: typeof View;
    };
}
