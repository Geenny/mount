import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemComponent, ISystemController, ISystemModel, ISystemView } from "../interface";
import { SYSTEM_EVENT } from "core/constants";

export class Controller extends BaseController implements ISystemController {

    protected component: ISystemComponent;
    protected model: ISystemModel;
    protected view: ISystemView;

    constructor( component: ISystemComponent, model: ISystemModel, view: ISystemView ) {
        super( component, model, view );

        // Component
        this.component = component;

        // MVC
        this.model = model;
        this.view = view;
    }

    async onStart(): Promise<void> {

        this.systemVisible();
        this.systemKeyboard();
        this.systemResize();

    }


    //
    // VISIBLE
    //

    protected systemVisible(): void {
        document.addEventListener( 'visibilitychange', () => {
            this.emit( SYSTEM_EVENT.VISIBLE, { visible: !document.hidden } );
        } );
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


    //
    // RESIZE
    //

    protected systemResize(): void {
        window.addEventListener( 'resize', () => {
            const data = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            this.emit( SYSTEM_EVENT.RESIZE, data );
        } );
    }

}