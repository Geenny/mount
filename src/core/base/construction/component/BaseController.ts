import { BaseWorker } from "core/base/BaseWorker";
import { BaseComponent } from "./BaseComponent";
import { BaseModel } from "./BaseModel";
import { BaseView } from "./BaseView";

export class BaseController extends BaseWorker {

    readonly component: BaseComponent;
    readonly model: BaseModel;
    readonly view?: BaseView;

    constructor( component: BaseComponent, model: BaseModel, view?: BaseView ) {
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
    // LIFECYCLE
    //

    async onInit(): Promise<void> {
        await super.onInit();

        this.model.configurate( this.config! );

        await this.view?.init( this.model.config );
    }

    async onDestroy(): Promise<void> {
        await super.onDestroy();
        await this.view?.destroy();
    }

    async onStart(): Promise<void> {
        await super.onStart();
        await this.view?.start();
    }

    async onStop(): Promise<void> {
        await super.onStop();
        await this.view?.stop();
    }

    async onPause(): Promise<void> {
        await super.onPause();
        await this.view?.pause();
    }

    async onUnpause(): Promise<void> {
        await super.onUnpause();
        await this.view?.unpause();
    }

}