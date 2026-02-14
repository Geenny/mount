import { BaseWorker, PromiseStructType } from "core/base";
import { ComponentConfigType, ComponentStructType } from "./types";
import { Unique } from "utils/unique/Unique";
import { BaseComponent } from "core/base/construction/component/BaseComponent";
export declare class Components extends BaseWorker {
    protected uniqueIDGen: Unique;
    protected uniguieNameGen: Unique;
    protected config: ComponentConfigType;
    protected componentConfigPrepareList: ComponentConfigType[];
    protected componentStructList: ComponentStructType[];
    protected promiseInitStruct?: PromiseStructType;
    protected promiseStartStruct?: PromiseStructType;
    protected onInit(): Promise<void>;
    protected componentsInit(): Promise<void>;
    protected promiseInitCreate(): Promise<void>;
    protected componentStructCreateByConfig(config: ComponentConfigType): ComponentStructType;
    /**
     * Рекурсивная проверка готовности компонентов к инициализации
     */
    protected componentInitReadyCheck(): Promise<void>;
    protected componentInit(config: ComponentConfigType): Promise<void>;
    protected componentsToInitGet(): ComponentConfigType[];
    protected componentsConfigPrepareRemoveByInit(componentsToInit: ComponentConfigType[]): void;
    protected componentSubscribeSet(componentStruct: ComponentStructType): void;
    protected componentSubscribeSubscriptionsGet(config: ComponentConfigType): BaseComponent[] | undefined;
    protected componentAddToList(componentStruct: ComponentStructType): void;
    protected componentRemoveFromList(componentStruct: ComponentStructType): void;
    protected onStart(): Promise<void>;
    protected promiseStartCreate(): Promise<void>;
    /**
     * Рекурсивная проверка готовности компонентов к запуску
     */
    protected componentStartReadyCheck(): Promise<void>;
    protected componentStart(component: BaseComponent): Promise<void>;
    protected componentsToStartGet(): BaseComponent[];
    protected configPrepareList(config?: ComponentConfigType): void;
    protected configPrepareFromRaw(config: ComponentConfigType): ComponentConfigType;
}
