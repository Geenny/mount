import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemKeyboardComponent, ISystemKeyboardController, ISystemKeyboardModel, ISystemKeyboardView } from "../interface";
import { SYSTEM_EVENT } from "core/constants";

export class Controller extends BaseController implements ISystemKeyboardController {

    protected component: ISystemKeyboardComponent;
    protected model: ISystemKeyboardModel;
    protected view: ISystemKeyboardView;

    constructor( component: ISystemKeyboardComponent, model: ISystemKeyboardModel, view: ISystemKeyboardView ) {
        super( component, model, view );

        // Component
        this.component = component;

        // MVC
        this.model = model;
        this.view = view;
    }

    async onStart(): Promise<void> {
        this.systemKeyboard();
    }

    //
    // KEYBOARD
    //

    protected systemKeyboard(): void {
        window.addEventListener( 'keydown', ( event ) => {
            const data = {
                action: 'down',
                key: event.key,
                code: event.keyCode,
                isShift: event.shiftKey,
                isCtrl: event.ctrlKey,
                isAlt: event.altKey
            };
            this.emit( SYSTEM_EVENT.KEYBOARD, data );
        } );

        window.addEventListener( 'keyup', ( event ) => {
            const data = {
                action: 'up',
                key: event.key,
                code: event.keyCode,
                isShift: event.shiftKey,
                isCtrl: event.ctrlKey,
                isAlt: event.altKey
            };
            this.emit( SYSTEM_EVENT.KEYBOARD, data );
        } );
    }

}
