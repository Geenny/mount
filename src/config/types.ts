import { DependencyName } from "core/dependency/enums";
import { ConfigType } from "../core/base/types";
import { BaseDependency } from "core/dependency/base/BaseDependency";
import { IBaseDependencyMachine } from "core/machine/dependency/base/interface";

type DependencyID = number; // Unique identifier for each Dependency

type DependencyDefaultConfigType = { options?: ConfigType, childrens?: ConfigType[] };

type DependencyMachineConfigType = DependencyDefaultConfigType & { childrens?: DependencyConfigType[] };

type DependencyConfigType = DependencyDefaultConfigType & { ID?: DependencyID, name: DependencyName, dependentList?: DependencyName[], instance: new (config: DependencyConfigType, machine: IBaseDependencyMachine) => BaseDependency };

export { DependencyMachineConfigType, DependencyConfigType, DependencyID };