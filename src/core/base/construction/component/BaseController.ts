import { BaseWorker } from "core/base/BaseWorker";
import { IComponent, IController, IModel, IView } from "./interface";
import { SubscribeEvent } from "../subscription/types";
import { output } from "utils/index";
import { SubscribeEventEnum, SubscribeTypeEnum } from "../subscription/enum";

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

    emit( event: SubscribeEvent, data?: any ): void {
        this.component.emit( event, data );
    }

    onEvent( event: SubscribeEvent, data?: any ): void {
        output.log( this, `Event received: ${ event.toString() }`, data );
    }

    subscribe( event: SubscribeEvent, method: Function ): void {
        // TODO: implement subscription logic

        // const data = { instance: this.component, event: SubscribeEventEnum.START, source: { event, method } };
        // this.component.message( SubscribeTypeEnum.SUBSCRIBE, data );
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
        await this.view?.pause( this.isPaused );
    }

    async onUnpause(): Promise<void> {
        await super.onUnpause();
        await this.view?.pause( this.isPaused );
    }

}