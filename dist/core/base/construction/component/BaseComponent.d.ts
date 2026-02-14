import { ConfigType } from "core/base/types";
import { BaseSubscription } from "../subscription/BaseSubscription";
import { IComponent, IController, IModel, IView } from "./interface";
import { ComponentClassesType } from "./types";
import { SubscribeData, SubscribeEvent } from "../subscription/types";
export declare class BaseComponent extends BaseSubscription implements IComponent {
    protected controller?: IController;
    protected model?: IModel;
    protected view?: IView;
    get ID(): number | undefined;
    get name(): string;
    get isUnique(): boolean;
    get isSyncStart(): boolean;
    get params(): ConfigType;
    protected classes: ComponentClassesType;
    protected createModel(): void;
    protected createView(): void;
    protected createController(): void;
    protected controllerSet(): void;
    subscribe(event: SubscribeEvent, method: Function): void;
    unsubscribe(event: SubscribeEvent, method: Function): void;
    emit(event: SubscribeEvent, data?: SubscribeData): void;
    protected onInit(): Promise<void>;
    protected onDestroy(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onStop(): Promise<void>;
    protected onPause(): Promise<void>;
    protected onUnpause(): Promise<void>;
}
