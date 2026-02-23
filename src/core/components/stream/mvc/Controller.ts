import { BaseController } from "core/base/construction/component/BaseController";
import { output } from "utils/index";
import { IStreamComponent, IStreamController, IStreamModel, IStreamView } from "../interface";
import { BaseRecipient } from "core/base/construction/recipient/BaseRecipient";
import { RecipientEvent, RecipientMessageData } from "core/base/construction/recipient/types";

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

    emit( event: RecipientEvent, data: any ): void {

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

    stream( instance: BaseRecipient, event: RecipientEvent, method: Function ): void {
        if ( !this.isWorking ) {
            output.error( this, 'StreamComponent: Is not working!!!' );
            return;
        }

        if ( !event ) {
            output.error( this, 'StreamComponent: Event is not defined' );
            return;
        }

        if ( !this.view.isExist( instance ) ) {
            output.error( this, 'StreamComponent: Instance is not registered!' );
            return;
        }

        this.view.subscribe( instance, event, method );
    }

    unstream(instance: BaseRecipient, event: RecipientEvent, method: Function): void {
        this.view.unsubscribe( instance, event, method );
    }


    //
    // INSTANCE MANAGEMENT
    //

    instanceAdd( instance: BaseRecipient ): void {
        this.view.add( instance );
    }

    instanceRemove( instance: BaseRecipient ): void {
        this.view.remove( instance );
    }

}