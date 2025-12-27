import { BaseDependencyMachine } from './BaseDependencyMachine';
import { DependencyMachineConfigType, DependencyConfigType } from 'config/types';
export declare class DependencyMachine extends BaseDependencyMachine {
    constructor(config?: DependencyMachineConfigType);
    add(dependencyConfig: DependencyConfigType): void;
}
