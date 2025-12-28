import { DependencyConfigType } from 'config/types';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
import { BaseDependencyDispatch } from '../base/BaseDependencyDispatch';
export declare class DependencyStorage extends BaseDependencyDispatch {
    constructor(config: DependencyConfigType, machine: IBaseDependencyMachine);
    onStart(): Promise<void>;
}
