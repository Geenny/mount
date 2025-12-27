import { BaseWorker } from 'core/base/BaseWorker';
import { DependencyConfigType } from 'config/types';
import { output } from 'utils/output/Output';
import { ConfigType } from 'core/base';

export abstract class BaseDependencyMachine {
  // Placeholder for forward reference
}

export abstract class BaseDependency extends BaseWorker {
  public readonly ID: number;
  public readonly name: string;
  public readonly options?: ConfigType;
  public readonly childrens?: any[];
  public readonly machine: BaseDependencyMachine;
  public readonly dependentList: BaseDependency[] = [];

  constructor(config: DependencyConfigType, machine: BaseDependencyMachine) {
    super(config);
    this.ID = config.ID || 0;
    this.name = config.name;
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
    const dependencies = (this.machine as any).getDependentDependencies(this.name);
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