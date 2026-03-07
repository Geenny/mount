import { BaseController } from "core/base/construction/component/BaseController";
import { IApplicationComponent, IApplicationController, IApplicationModel, IApplicationView } from "../interface";
import { SYSTEM_EVENT, NETWORK_EVENT } from "core/constants";

export class ApplicationController extends BaseController implements IApplicationController {

    protected component: IApplicationComponent;
    protected model: IApplicationModel;
    protected view: IApplicationView;

    constructor( component: IApplicationComponent, model: IApplicationModel, view: IApplicationView ) {
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

        this.subscribe( SYSTEM_EVENT.KEYBOARD, ( data: any ) => {
            console.log( 'KEYBOARD', data );
        });

        this.subscribe( SYSTEM_EVENT.VISIBILITY, ( data: any ) => {
            console.log( 'VISIBILITY', data );
        });

        this.subscribe( SYSTEM_EVENT.RESIZE, ( data: any ) => {
            console.log( 'RESIZE', data );
        });

        setTimeout( () => {
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 1" } );
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 2" } );
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 3" } );
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 4" } );
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 5" } );
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 6" } );
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 7" } );
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 8" } );
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 9" } );
            this.emit( NETWORK_EVENT.SEND, { endpoint: "/health", data: "Some message 10" } );
        }, 1000 );

    }

}