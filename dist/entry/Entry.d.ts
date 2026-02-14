import { Components } from "core/components/Components";
import { ComponentConfigType } from "core/components/types";
declare global {
    interface Window {
        app?: Components;
    }
}
export declare class Entry {
    private components?;
    constructor();
    start(): Promise<void>;
    /**
     * For overriden in subclasses to provide custom config
     * @returns @AppConfigType
     */
    configGet(): ComponentConfigType;
}
