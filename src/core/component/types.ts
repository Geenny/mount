import { IndentifyConfigType } from "core/base";
import { ComponentName, ComponentTypeName } from "./enums";
import { BaseComponent } from "core/base/construction/component/BaseComponent";

type ComponentType = ComponentTypeName;

type ComponentConfigType = {
    ID?: number,
    name: ComponentName,
    type: ComponentType,
    unique?: boolean,
    syncStart?: boolean,
    instance?: typeof BaseComponent, // instance?: new () => Component,
    components?: Record<string, ComponentConfigType>,
    dependent?: ComponentName[],
    params?: any
};

type ComponentStructType = { component: BaseComponent, config: ComponentConfigType }

export { ComponentType, ComponentConfigType, ComponentStructType };