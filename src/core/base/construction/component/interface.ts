import { IWorker } from "core/base/interface";
import { ConfigType } from "core/base/types";
import { SubscribeEvent, SubscribeMessageData } from "../subscription/types";
import { SubscribeTypeEnum } from "../subscription/enum";

interface IComponent {

    ID?: number;

    name: string;

    isUnique: boolean;

    isSyncStart: boolean;

    params: ConfigType;

    emit( event: SubscribeEvent, data?: any ): void;

    onEvent( event: SubscribeEvent, data?: any ): void;

    onMessage( type: SubscribeTypeEnum, data: SubscribeMessageData ): void;

}

interface IController extends IWorker {

    onModelChange( key: string, value: any ): void;

    onViewEvent( eventName: string, ...args: any[] ): void;

    emit( event: SubscribeEvent, data?: any ): void;

    onEvent( event: SubscribeEvent, data?: any ): void;

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