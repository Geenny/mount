import { DependencyName } from "core/dependency/enums";
import { ConfigType } from "../core/base/types";

type DependencyDefaultConfigType = { options?: ConfigType };

type DependencyMachineConfigType = DependencyDefaultConfigType &{ childrens?: DependencyConfigType[] };

type DependencyID = number; // Unique identifier for each Dependency

type DependencyConfigType = { ID?: DependencyID, name: DependencyName, dependentList?: DependencyName[], options?: ConfigType };

export { DependencyMachineConfigType, DependencyConfigType, DependencyID };