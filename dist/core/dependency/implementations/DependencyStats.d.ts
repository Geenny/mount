import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';
export declare class DependencyStats extends BaseDependency {
    constructor(config: DependencyConfigType, machine: any);
    onStart(): Promise<void>;
}
