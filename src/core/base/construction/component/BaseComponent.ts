import { ConfigType } from "core/base/types";
import { BaseSubscription } from "../subscription/BaseSubscription";
import { BaseController } from "./BaseController";
import { BaseModel } from "./BaseModel";
import { BaseView } from "./BaseView";
import { IComponent, IController, IModel, IView } from "./interface";
import { ComponentClassesType } from "./types";
import { SubscribeData, SubscribeEvent } from "../subscription/types";
import { SubscribeActionEnum, SubscribeTypeEnum } from "../subscription/enum";

export class BaseComponent extends BaseSubscription implements IComponent {

    protected controller?: IController;
    protected model?: IModel;
    protected view?: IView;

    get ID(): number | undefined {
        return this.config.ID;
    }

    get name(): string {
        return this.config.name;
    }

    get isUnique(): boolean {
        return !!this.config.unique;
    }

    get isSyncStart(): boolean {
        return !!this.config.syncStart;
    }

    get params(): ConfigType {
        return this.config.params || { };
    }


    //
    // MVC
    //

    protected classes: ComponentClassesType = {
        Controller: BaseController,
        Model: BaseModel,
        View: BaseView,
    };

    protected createModel(): void {
        this.model = new this.classes.Model();
    }

    protected createView(): void {
        this.view = new this.classes.View();
    }

    protected createController(): void {
        if ( !this.model ) throw new Error( 'Model is not created' );
        this.controller = new this.classes.Controller( this, this.model, this.view );
    }

    protected controllerSet(): void {
        this.model?.controllerSet( this.controller! );
        this.view?.controllerSet( this.controller! );
    }


    //
    // SUBSCRIPTIONS
    //

    subscribe( event: SubscribeEvent, method: Function ): void {
        const messageData = { instance: this, source: { event, method } };
        this.message( SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, messageData );
    }

    unsubscribe( event: SubscribeEvent, method: Function ): void {
        const messageData = { instance: this, source: { event, method } };
        this.message( SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.STOP, messageData );
    }

    emit( event: SubscribeEvent, data?: SubscribeData ): void {
        const messageData = { instance: this, source: { event, data } };
        this.message( SubscribeTypeEnum.DATA, SubscribeActionEnum.START, messageData );
    }



    //
    // LIFECYCLE
    //

    protected async onInit(): Promise<void> {
        await super.onInit();

        this.createModel();
        this.createView();
        this.createController();

        this.controllerSet();

        this.model?.configurate( this.params );
        await this.view?.init( {} );
        await this.controller?.init( {} );

        const messageData = { instance: this };
        this.message( SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, messageData );
    }

    protected async onDestroy(): Promise<void> {
        await super.onDestroy();
        await this.controller?.destroy();
        await this.view?.destroy();

        const messageData = { instance: this };
        this.message( SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.STOP, messageData );
    }

    protected async onStart(): Promise<void> {
        await super.onStart();
        await this.view?.start();
        await this.controller?.start();
    }

    protected async onStop(): Promise<void> {
        await super.onStop();
        await this.view?.stop();
        await this.controller?.stop();
    }

    protected async onPause(): Promise<void> {
        await super.onPause();
        await this.view?.pause( this.isPaused );
        await this.controller?.pause( this.isPaused );
    }

    protected async onUnpause(): Promise<void> {
        await super.onUnpause();
        await this.view?.pause( this.isPaused );
        await this.controller?.pause( this.isPaused );
    }

}