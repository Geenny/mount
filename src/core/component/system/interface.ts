import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";

interface ISystemComponent extends IComponent {

}

interface ISystemModel extends IModel {

}

interface ISystemView extends IView {

}

interface ISystemController extends IController {
    
}

export { ISystemComponent, ISystemModel, ISystemView, ISystemController };