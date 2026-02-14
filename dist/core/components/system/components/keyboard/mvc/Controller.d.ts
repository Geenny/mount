import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemKeyboardComponent, ISystemKeyboardController, ISystemKeyboardModel, ISystemKeyboardView } from "../interface";
export declare class Controller extends BaseController implements ISystemKeyboardController {
    protected component: ISystemKeyboardComponent;
    protected model: ISystemKeyboardModel;
    protected view: ISystemKeyboardView;
    constructor(component: ISystemKeyboardComponent, model: ISystemKeyboardModel, view: ISystemKeyboardView);
    onStart(): Promise<void>;
    protected systemKeyboard(): void;
}
