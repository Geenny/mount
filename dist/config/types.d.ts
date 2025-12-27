import { ConfigType } from "../core/base/types";
type DependencyMachineConfigType = {
    childrens?: DependencyConfigType[];
};
type DependencyID = string;
type DependencyConfigType = {
    ID: DependencyID;
    name: string;
    dependentList?: DependencyID[];
    options?: ConfigType;
};
export { DependencyMachineConfigType, DependencyConfigType, DependencyID };
