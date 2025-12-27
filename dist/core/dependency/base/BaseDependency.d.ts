import { BaseWorker } from 'core/base/BaseWorker';
import { DependencyConfigType } from 'config/types';
import { ConfigType } from 'core/base';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
import { DependencyName } from 'core/dependency/enums';
export declare abstract class BaseDependencyMachine {
}
export declare abstract class BaseDependency extends BaseWorker {
    readonly ID: number;
    readonly name: DependencyName;
    readonly options?: ConfigType;
    readonly childrens?: any[];
    readonly machine: IBaseDependencyMachine;
    readonly dependentList: BaseDependency[];
    constructor(config: DependencyConfigType, machine: IBaseDependencyMachine);
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
