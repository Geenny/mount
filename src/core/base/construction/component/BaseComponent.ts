import { ConfigType } from "core/base/types";
import { BaseSubscription } from "../subscription/BaseSubscription";
import { BaseController } from "./BaseController";
import { BaseModel } from "./BaseModel";
import { BaseView } from "./BaseView";
import { ComponentName } from "core/component/enums";
import { IComponent, IController, IModel, IView } from "./interface";
import { ComponentClassesType } from "./types";
import { SubscribeEvent } from "../subscription/types";
import { SubscribeEventEnum, SubscribeTypeEnum } from "../subscription/enum";

export class BaseComponent extends BaseSubscription implements IComponent {

    protected controller?: IController;
    protected model?: IModel;
    protected view?: IView;

    get ID(): number | undefined {
        return this.config?.ID;
    }

    get name(): ComponentName {
        return this.config?.name;
    }

    get isUnique(): boolean {
        return !!this.config?.unique;
    }

    get isSyncStart(): boolean {
        return !!this.config?.syncStart;
    }

    get params(): ConfigType {
        return this.config?.params || { };
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

    onEvent( event: SubscribeEvent, data?: any ): void {
        this.controller?.onEvent( event, data );
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

        await this.controller?.init( this.params );

        this.message( SubscribeTypeEnum.SYSTEM, { instance: this, event: SubscribeEventEnum.START } );
    }

    protected async onDestroy(): Promise<void> {
        await super.onDestroy();
        await this.controller?.destroy();

        this.message( SubscribeTypeEnum.SYSTEM, { instance: this, event: SubscribeEventEnum.STOP } );
    }

    protected async onStart(): Promise<void> {
        await super.onStart();
        await this.controller?.start();
    }

    protected async onStop(): Promise<void> {
        await super.onStop();
        await this.controller?.stop();
    }

    protected async onPause(): Promise<void> {
        await super.onPause();
        await this.controller?.pause( this.isPaused );
    }

    protected async onUnpause(): Promise<void> {
        await super.onUnpause();
        await this.controller?.pause( this.isPaused );
    }

}