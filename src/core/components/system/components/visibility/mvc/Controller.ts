import { BaseController } from "core/base/construction/component/BaseController";
import { ISystemVisibilityComponent, ISystemVisibilityController, ISystemVisibilityModel, ISystemVisibilityView } from "../interface";
import { SYSTEM_EVENT } from "core/constants";

export class Controller extends BaseController implements ISystemVisibilityController {

    protected component: ISystemVisibilityComponent;
    protected model: ISystemVisibilityModel;
    protected view: ISystemVisibilityView;

    constructor( component: ISystemVisibilityComponent, model: ISystemVisibilityModel, view: ISystemVisibilityView ) {
        super( component, model, view );

        // Component
        this.component = component;

        // MVC
        this.model = model;
        this.view = view;
    }

    async onStart(): Promise<void> {
        this.systemVisible();
    }

    //
    // VISIBILITY
    //

    protected systemVisible(): void {
        document.addEventListener( 'visibilitychange', () => {
            this.emit( SYSTEM_EVENT.VISIBILITY, { visible: !document.hidden } );
        } );
    }

}
