import { DependencyName } from "core/dependency/enums";
import { ConfigType } from "../core/base/types";
type DependencyID = number;
type DependencyDefaultConfigType = {
    options?: ConfigType;
    childrens?: ConfigType[];
};
type DependencyMachineConfigType = DependencyDefaultConfigType & {
    childrens?: DependencyConfigType[];
};
type DependencyConfigType = DependencyDefaultConfigType & {
    ID?: DependencyID;
    name: DependencyName;
    dependentList?: DependencyName[];
};
export { DependencyMachineConfigType, DependencyConfigType, DependencyID };
