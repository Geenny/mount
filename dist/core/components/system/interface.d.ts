import { IComponent, IController, IModel, IView } from "core/base/construction/component/interface";
import { SystemVisibleDataType, SystemKeyboardDataType, SystemResizeDataType } from "./types";
interface ISystemComponent extends IComponent {
}
interface ISystemModel extends IModel {
    visibility: SystemVisibleDataType;
    keyboard: SystemKeyboardDataType | undefined;
    resize: SystemResizeDataType | undefined;
}
interface ISystemView extends IView {
}
interface ISystemController extends IController {
}
export { ISystemComponent, ISystemModel, ISystemView, ISystemController };
