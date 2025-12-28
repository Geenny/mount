import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
export declare class DependencyInit extends BaseDependency {
    constructor(config: DependencyConfigType, machine: IBaseDependencyMachine);
    onStart(): Promise<void>;
}
