import { ConfigType } from "core/base/types";
import { IController, IModel } from "./interface";
export declare class BaseModel implements IModel {
    protected controller?: IController;
    /**
     * Reactive data storage with Proxy
     * Automatically triggers onModelChange when properties are modified
     */
    protected data: Record<string, any>;
    constructor();
    controllerSet(controller: IController): void;
    configurate(config?: ConfigType): void;
    unconfigurate(): void;
}
