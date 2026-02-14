import { IndentifyConfigType } from "core/base";
import { ComponentNameEnum, ComponentSystemNameEnum, ComponentTypeEnum } from "./enums";
import { BaseComponent } from "core/base/construction/component/BaseComponent";

type ComponentName = string;
type ComponentType = ComponentTypeEnum;

type ComponentConfigType = {
    ID?: number,
    name: ComponentName,
    type: ComponentType,
    unique?: boolean,
    syncStart?: boolean,
    instance?: typeof BaseComponent, // instance?: new () => Component,
    components?: Record<ComponentName, ComponentConfigType>,
    dependent?: ComponentName[],
    params?: any
};

type ComponentStructType = { component: BaseComponent, config: ComponentConfigType }

export {
    ComponentName,
    ComponentType,
    ComponentConfigType,
    ComponentStructType
};