import { IWorker } from "core/base/interface";
import { ConfigType } from "core/base/types";
import { RecipientData, RecipientEvent, RecipientMessageData } from "../recipient/types";
import { RecipientActionEnum, RecipientTypeEnum } from "../recipient/enum";

interface IComponent {

    ID?: number;

    name: string;

    isUnique: boolean;

    isSyncStart: boolean;

    params: ConfigType;

    subscribe( event: RecipientEvent, method: Function ): void;
    unsubscribe( event: RecipientEvent, method: Function ): void;
    emit( event: RecipientEvent, data?: RecipientData ): void;

    /**
     * Messages between @BaseRecipient instances
     * @param type {@RecipientTypeEnum}
     * @param action {@RecipientActionEnum}
     * @param data {@RecipientMessageData}
     */
    onMessage( type: RecipientTypeEnum, action: RecipientActionEnum, data: RecipientMessageData ): void;

}

interface IController extends IWorker {

    onModelChange( key: string, value: any ): void;

    onViewEvent( eventName: string, ...args: any[] ): void;

    emit( event: RecipientEvent, data?: RecipientData ): void;

    onEvent( event: RecipientEvent, data?: RecipientData ): void;

}

interface IModel {

    controllerSet( controller: IController ): void;

    configurate( config?: ConfigType ): void;
    
    unconfigurate(): void;

}

interface IView extends IWorker {

    controllerSet( controller: IController ): void;

}

export { IComponent, IController, IModel, IView };