import { BaseWorker } from 'core/base/BaseWorker';
import { DependencyConfigType } from 'config/types';
import { output } from 'utils/output/Output';
import { ConfigType } from 'core/base';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
import { DependencyName } from 'core/dependency/enums';

export abstract class BaseDependencyMachine {
  // Placeholder for forward reference
}

export abstract class BaseDependency extends BaseWorker {
  public readonly ID: number;
  public readonly name: DependencyName;
  public readonly options?: ConfigType;
  public readonly childrens?: ConfigType[];
  public readonly machine: IBaseDependencyMachine;
  public readonly dependentList: BaseDependency[] = [];

  constructor(config: DependencyConfigType, machine: IBaseDependencyMachine) {
    super(config);
    this.ID = config.ID || 0;
    this.name = config.name as DependencyName;
    this.options = config.options;
    this.childrens = config.childrens;
    this.machine = machine;
  }

  protected dependencyAddToList(dependency: BaseDependency): void {
    if (!this.dependentList.includes(dependency)) {
      this.dependentList.push(dependency);
    }
  }

  protected dependencyRemoveFromList(): void {
    this.dependentList.length = 0;
  }

  protected async initDependentDependencies(): Promise<void> {
    const dependencies = this.machine.getDependentDependencies(this.name);
    for (const dep of dependencies) {
      this.dependencyAddToList(dep);
    }
  }

  protected async onInit(): Promise<void> {
    await this.initDependentDependencies();
  }

  protected async onDestroy(): Promise<void> {
    (this as any).machine = null;
    this.dependencyRemoveFromList();
  }

  protected async onStart(): Promise<void> {
    output.log(this, `Dependency ${this.name} started`);
  }

  protected async onStop(): Promise<void> {
    output.log(this, `Dependency ${this.name} stopped`);
  }

  protected async onPause(): Promise<void> {
    output.log(this, `Dependency ${this.name} paused`);
  }

  protected async onUnpause(): Promise<void> {
    output.log(this, `Dependency ${this.name} unpaused`);
  }
}