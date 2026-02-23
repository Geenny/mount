import { BaseWorker } from "core/base/BaseWorker";
import { IComponent, IController, IModel, IView } from "./interface";
import { RecipientData, RecipientEvent } from "../recipient/types";
import { output } from "utils/index";

export class BaseController extends BaseWorker implements IController {

    protected component: IComponent;
    protected model: IModel;
    protected view?: IView;

    constructor( component: IComponent, model: IModel, view?: IView ) {
        super();

        // Component
        this.component = component;

        // MVC
        this.model = model;
        this.view = view;
    }


    //
    // MODEL
    //

    onModelChange( key: string, value: any ): void {

    }


    //
    // VIEW
    //

    onViewEvent( eventName: string, ...args: any[] ): void {

    }


    //
    // SUBSCRIPTIONS
    //

    emit( event: RecipientEvent, data?: RecipientData ): void {
        this.component.emit( event, data );
    }

    onEvent( event: RecipientEvent, data?: RecipientData ): void {
        output.log( this, `Event received: ${ event.toString() }`, data );
    }

    subscribe( event: RecipientEvent, method: Function ): void {
        this.component.subscribe( event, method );
    }

    unsubscribe( event: RecipientEvent, method: Function ): void {
        this.component.unsubscribe( event, method );
    }

}