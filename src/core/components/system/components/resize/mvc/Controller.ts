import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemResizeComponent, ISystemResizeController, ISystemResizeModel, ISystemResizeView } from "../interface";
import { SYSTEM_EVENT } from "core/constants";

export class Controller extends BaseController implements ISystemResizeController {

    protected component: ISystemResizeComponent;
    protected model: ISystemResizeModel;
    protected view: ISystemResizeView;

    constructor( component: ISystemResizeComponent, model: ISystemResizeModel, view: ISystemResizeView ) {
        super( component, model, view );

        // Component
        this.component = component;

        // MVC
        this.model = model;
        this.view = view;
    }

    async onStart(): Promise<void> {
        this.systemResize();
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
