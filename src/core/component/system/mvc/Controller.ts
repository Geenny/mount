import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemComponent, ISystemController, ISystemModel, ISystemView } from "../interface";

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

        setInterval( () => {
            this.emit( 'start', { data: 'some data' } );
        }, 1000 );

        setInterval( () => {
            this.emit( 'end', { data: 'some data' } );
        }, 800 );

        this.subscribe( 'start', ( data: any ) => {
            console.log( 'SystemComponent: Start event received in Controller', data );
        });

    }

}