import { BaseComponent } from "core/base/construction/component/BaseComponent";
import { Controller } from "./mvc/Controller";
import { Model } from "./mvc/Model";
import { View } from "./mvc/View";

export class StreamComponent extends BaseComponent {

    protected classes = {
        Controller: Controller,
        Model: Model,
        View: View
    };

}