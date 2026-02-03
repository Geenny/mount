import { BaseController } from "core/base/construction/component/BaseController";
import { output } from "utils/index";
import { IStreamComponent, IStreamController, IStreamModel, IStreamView } from "../interface";
import { BaseSubscription } from "core/base/construction/subscription/BaseSubscription";
import { SubscribeEvent, SubscribeMessageData } from "core/base/construction/subscription/types";

export class Controller extends BaseController implements IStreamController {

    protected component: IStreamComponent;
    protected model: IStreamModel;
    protected view: IStreamView;

    constructor( component: IStreamComponent, model: IStreamModel, view: IStreamView ) {
        super( component, model, view );

        // Component
        this.component = component;

        // MVC
        this.model = model;
        this.view = view;
    }

    emit( event: SubscribeEvent, data: any ): void {

        if ( !this.isWorking ) {
            output.error( this, 'StreamComponent: Is not working!!!' );
            return;
        }

        if ( !event ) {
            output.error( this, 'StreamComponent: Event is not defined' );
            return;
        }

        const list = this.view.byEventGet( event );

        list.forEach( ( { method } ) => {
            method( data );
        } );
    }

    subscribe( instance: BaseSubscription, event: SubscribeEvent, method: Function ): void {
        if ( !this.isWorking ) {
            output.error( this, 'StreamComponent: Is not working!!!' );
            return;
        }

        if ( !event ) {
            output.error( this, 'StreamComponent: Event is not defined' );
            return;
        }

        if ( this.view.isExist( instance ) ) {
            output.error( this, 'StreamComponent: Instance is not registered!' );
            return;
        }

        this.view.subscribe( instance, event, method );
    }

    unsubscribe(instance: BaseSubscription, event: SubscribeEvent, method: Function): void {
        this.view.unsubscribe( instance, event, method );
    }


    //
    // INSTANCE MANAGEMENT
    //

    instanceAdd( instance: BaseSubscription ): void {
        this.view.add( instance );
    }

    instanceRemove( instance: BaseSubscription ): void {
        this.view.remove( instance );
    }

}