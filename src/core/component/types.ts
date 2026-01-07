import { IndentifyConfigType } from "core/base";
import { ComponentName, ComponentTypeName } from "./enums";
import { Component } from "./Component";

type ComponentType = ComponentTypeName;

type ComponentConfigType = {
    ID?: number,
    name: ComponentName,
    type: ComponentType,
    unique?: boolean,
    syncStart?: boolean,
    instance?: typeof Component, // instance?: new () => Component,
    components?: Record<string, ComponentConfigType>,
    dependent?: ComponentName[],
    params?: any
};

type ComponentStructType = { component: Component, config: ComponentConfigType }

export { ComponentType, ComponentConfigType, ComponentStructType };