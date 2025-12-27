import { BaseWorker } from 'core/base/BaseWorker';
import { DependencyConfigType } from 'config/types';
import { ConfigType } from 'core/base';
export declare abstract class BaseDependencyMachine {
}
export declare abstract class BaseDependency extends BaseWorker {
    readonly ID: number;
    readonly name: string;
    readonly options?: ConfigType;
    readonly childrens?: any[];
    readonly machine: BaseDependencyMachine;
    readonly dependentList: BaseDependency[];
    constructor(config: DependencyConfigType, machine: BaseDependencyMachine);
    protected dependencyAddToList(dependency: BaseDependency): void;
    protected dependencyRemoveFromList(): void;
    protected initDependentDependencies(): Promise<void>;
    protected onInit(): Promise<void>;
    protected onDestroy(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onStop(): Promise<void>;
    protected onPause(): Promise<void>;
    protected onUnpause(): Promise<void>;
}
