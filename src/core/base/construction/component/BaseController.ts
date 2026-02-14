import { BaseWorker } from "core/base/BaseWorker";
import { IComponent, IController, IModel, IView } from "./interface";
import { SubscribeData, SubscribeEvent } from "../subscription/types";
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

    emit( event: SubscribeEvent, data?: SubscribeData ): void {
        this.component.emit( event, data );
    }

    onEvent( event: SubscribeEvent, data?: SubscribeData ): void {
        output.log( this, `Event received: ${ event.toString() }`, data );
    }

    subscribe( event: SubscribeEvent, method: Function ): void {
        this.component.subscribe( event, method );
    }

    unsubscribe( event: SubscribeEvent, method: Function ): void {
        this.component.unsubscribe( event, method );
    }

}