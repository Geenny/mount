import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemComponent, ISystemController, ISystemModel, ISystemView } from "../interface";
import { SYSTEM_EVENT } from "core/constants";
import { SystemVisibleDataType, SystemKeyboardDataType, SystemResizeDataType } from "../types";

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
        this.subscribeToSystemEvents();
    }

    //
    // SUBSCRIPTIONS
    //

    protected subscribeToSystemEvents(): void {
        // Subscribe to VISIBLE events
        this.component.subscribe( SYSTEM_EVENT.VISIBILITY, ( data: SystemVisibleDataType ) => {
            this.model.visibility = data;
        } );

        // Subscribe to KEYBOARD events
        this.component.subscribe( SYSTEM_EVENT.KEYBOARD, ( data: SystemKeyboardDataType ) => {
            this.model.keyboard = data;
        } );

        // Subscribe to RESIZE events
        this.component.subscribe( SYSTEM_EVENT.RESIZE, ( data: SystemResizeDataType ) => {
            this.model.resize = data;
        } );
    }

    //
    // Model Change
    //

    onModelChange( key: string, value: any ): void {
        console.log( `Model changed: ${key} =`, value );
    }

}