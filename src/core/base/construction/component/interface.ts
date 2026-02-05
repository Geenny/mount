import { IWorker } from "core/base/interface";
import { ConfigType } from "core/base/types";
import { SubscribeData, SubscribeEvent, SubscribeMessageData } from "../subscription/types";
import { SubscribeActionEnum, SubscribeTypeEnum } from "../subscription/enum";

interface IComponent {

    ID?: number;

    name: string;

    isUnique: boolean;

    isSyncStart: boolean;

    params: ConfigType;

    subscribe( event: SubscribeEvent, method: Function ): void;
    unsubscribe( event: SubscribeEvent, method: Function ): void;
    emit( event: SubscribeEvent, data?: SubscribeData ): void;

    /**
     * Messages between @BaseSubscription instances
     * @param type {@SubscribeTypeEnum}
     * @param action {@SubscribeActionEnum}
     * @param data {@SubscribeMessageData}
     */
    onMessage( type: SubscribeTypeEnum, action: SubscribeActionEnum, data: SubscribeMessageData ): void;

}

interface IController extends IWorker {

    onModelChange( key: string, value: any ): void;

    onViewEvent( eventName: string, ...args: any[] ): void;

    emit( event: SubscribeEvent, data?: SubscribeData ): void;

    onEvent( event: SubscribeEvent, data?: SubscribeData ): void;

}

interface IModel {

    config: ConfigType;

    controllerSet( controller: IController ): void;

    configurate( config?: ConfigType ): void;

    set ( key: string, value: any ): void;

    get ( key: string ): any;

}

interface IView extends IWorker {

    controllerSet( controller: IController ): void;

}

export { IComponent, IController, IModel, IView };