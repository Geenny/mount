import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";

interface IApplicationComponent extends IComponent {

}

interface IApplicationModel extends IModel {

}

interface IApplicationView extends IView {

}

interface IApplicationController extends IController {
    
}

export { IApplicationComponent, IApplicationModel, IApplicationView, IApplicationController };