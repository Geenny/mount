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

        // setInterval( () => {
        //     this.emit( 'start', { data: 'some data' } );
        // }, 1000 );

        // setInterval( () => {
        //     this.emit( 'end', { data: 'some data' } );
        // }, 800 );

        // this.subscribe( 'start', ( data: any ) => {
        //     console.log( 'SystemComponent: Start event received in Controller', data );
        // });

        this.systemVisible();
        this.systemKeyboard();

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

}