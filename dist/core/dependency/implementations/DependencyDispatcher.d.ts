import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';
export declare class DependencyDispatcher extends BaseDependency {
    constructor(config: DependencyConfigType, machine: any);
    onStart(): Promise<void>;
}
