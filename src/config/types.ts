// import { DependencyName } from "core/dependency/enums";
import { ConfigType } from "../core/base/types";
// import { BaseDependency } from "core/dependency/base/BaseDependency";
// import { IBaseDependencyMachine } from "core/machine/dependency/base/interface";


//
// APPLICATION TYPES
//

// type AppConfigType = {
//     name: string,
//     version: string,
//     debug?: boolean,
//     configs?: Record<string, ConfigType>;
// };


//
// DEPENDENCY TYPES
//

// type DependencyID = number; // Unique identifier for each Dependency
// type DependencyDefaultConfigType = { options?: ConfigType, childrens?: ConfigType[] };
// type DependencyMachineConfigType = DependencyDefaultConfigType & { childrens?: DependencyConfigType[] };
// type DependencyConfigType = DependencyDefaultConfigType & { ID?: DependencyID, name: DependencyName, dependentList?: DependencyName[], instance: new (config: DependencyConfigType, machine: IBaseDependencyMachine) => BaseDependency };


//
// STATE TYPES
//

// type StateMachineConfigType = DependencyDefaultConfigType & { childrens: { state: string, from: string[], to: string[] }[] };


// //
// // SYSTEM TYPES
// //

// type SystemConfigType = DependencyDefaultConfigType & { name: string, instance: new ( config: SystemConfigType ) => any };
// type SystemMachineConfigType = DependencyDefaultConfigType & { childrens: SystemConfigType[] };


// //
// // SERVICE TYPES
// //

// type ServiceConfigType = DependencyDefaultConfigType & { name: string, instance: new ( config: ServiceConfigType ) => any };
// type ServiceMachineConfigType = DependencyDefaultConfigType & { childrens: ServiceConfigType[] };

// export {
//     AppConfigType,
//     DependencyMachineConfigType, DependencyConfigType, DependencyID,
//     StateMachineConfigType,
//     SystemMachineConfigType, SystemConfigType,
//     ServiceMachineConfigType, ServiceConfigType,
// };