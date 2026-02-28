import { ConfigType } from "core/base/types";
import { BaseRecipient } from "../recipient/BaseRecipient";
import { BaseController } from "./BaseController";
import { BaseModel } from "./BaseModel";
import { BaseView } from "./BaseView";
import { IComponent, IController, IModel, IView } from "./interface";
import { ComponentClassesType } from "./types";
import { RecipientData, RecipientEvent } from "../recipient/types";
import { RecipientActionEnum, RecipientTypeEnum } from "../recipient/enum";

export class BaseComponent extends BaseRecipient implements IComponent {

    protected childrenList: IComponent[] = [];

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
        const ModelClass = this.classes.Model;
        if ( !ModelClass ) return;
        this.model = new ModelClass();
    }

    protected createView(): void {
        const ViewClass = this.classes.View;
        if ( !ViewClass ) return;
        this.view = new ViewClass();
    }

    protected createController(): void {
        if ( !this.model ) throw new Error( 'Model is not created' );
        const ControllerClass = this.classes.Controller;
        this.controller = new ControllerClass( this, this.model, this.view );
    }

    protected controllerSet(): void {
        this.model?.controllerSet( this.controller! );
        this.view?.controllerSet( this.controller! );
    }


    //
    // SUBSCRIPTIONS
    //

    /**
     * Broadcast message to Recipients that subscribe is created
     */
    subscribe( event: RecipientEvent, method: Function ): void {
        const messageData = { instance: this, source: { event, method } };
        this.message( RecipientTypeEnum.SUBSCRIBE, RecipientActionEnum.START, messageData );
    }
    unsubscribe( event: RecipientEvent, method: Function ): void {
        const messageData = { instance: this, source: { event, method } };
        this.message( RecipientTypeEnum.SUBSCRIBE, RecipientActionEnum.STOP, messageData );
    }

    /**
     * Broadcast message to Recipients that data is emitted
     */
    emit( event: RecipientEvent, data?: RecipientData ): void {
        const messageData = { instance: this, source: { event, data } };
        this.message( RecipientTypeEnum.DATA, RecipientActionEnum.START, messageData );
    }



    //
    // MESSAGES
    //

    onMessage( type: RecipientTypeEnum, action: RecipientActionEnum, data: RecipientData ): void {

        // Just RecipientTypeEnum.SYSTEM messages
        if ( type !== RecipientTypeEnum.SYSTEM ) return;

        // Ignore own messages
        if ( data.instance === this ) return;

        // Handle children add/remove
        this.childrenHandle( action, data.instance );

    }



    //
    // CHILDREN
    //

    protected childrenHandle( action: RecipientActionEnum, instance: BaseComponent ): void {
        switch ( action ) {
            case RecipientActionEnum.START:
                this.childrenAdd( instance );
                break;
            case RecipientActionEnum.STOP:
                this.childrenRemove( instance );
                break;
        }
    }

    protected childrenAdd( instance: BaseComponent ): void {

        // Check ID is number more than 0
        if ( instance.ID === undefined || instance.ID <= 0 ) return;

        // Check if instance is already a child
        if ( this.childrenList.includes( instance ) ) return;
        
        // Add to children list
        this.childrenList.push( instance );

    }

    protected childrenRemove( instance: BaseComponent ): void {

        // Check if instance is already a child
        if ( !this.childrenList.includes( instance ) ) return;
        
        // Remove from children list
        this.childrenList = this.childrenList.filter( child => child !== instance );

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
        await this.view?.init();
        await this.controller?.init();

        const messageData = { instance: this };
        this.message( RecipientTypeEnum.SYSTEM, RecipientActionEnum.START, messageData );
    }

    protected async onDestroy(): Promise<void> {
        await super.onDestroy();
        await this.controller?.destroy();
        await this.view?.destroy();

        const messageData = { instance: this };
        this.message( RecipientTypeEnum.SYSTEM, RecipientActionEnum.STOP, messageData );
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