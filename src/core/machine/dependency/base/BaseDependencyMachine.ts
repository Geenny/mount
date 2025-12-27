import { BaseWorker } from 'core/base/BaseWorker';
import { DependencyMachineConfigType, DependencyConfigType } from 'config/types';
import { DependencyName } from 'core/dependency/enums';
import { BaseDependency } from 'core/dependency/base/BaseDependency';
import { output } from 'utils/output/Output';

export abstract class BaseDependencyMachine extends BaseWorker {
  protected config: DependencyMachineConfigType;
  protected dependencies: Map<DependencyName, BaseDependency> = new Map();

  constructor(config: DependencyMachineConfigType) {
    super(config);
    this.config = config;
  }

  add(dependencyConfig: DependencyConfigType): void {
    if (this.dependencies.has(dependencyConfig.name)) {
      output.warn(this, `Dependency ${dependencyConfig.name} already exists`);
      return;
    }
    // Note: Concrete implementation needed for creating specific dependency instances
    // For now, placeholder
    // const dependency = new ConcreteDependency(dependencyConfig, this);
    // this.dependencies.set(dependencyConfig.name, dependency);
  }

  remove(dependencyName: DependencyName): void {
    const dependency = this.dependencies.get(dependencyName);
    if (!dependency) {
      output.warn(this, `Dependency ${dependencyName} not found`);
      return;
    }
    // Check for running dependents and stop them
    // Placeholder logic
    dependency.destroy();
    this.dependencies.delete(dependencyName);
  }

  addAll(dependencyConfigs: DependencyConfigType[]): void {
    for (const config of dependencyConfigs) {
      this.add(config);
    }
  }

  removeAll(): void {
    for (const name of this.dependencies.keys()) {
      this.remove(name);
    }
  }

  addByName(dependencyName: DependencyName): void {
    // Find config by name - placeholder
    // const config = findConfig(dependencyName);
    // this.add(config);
  }

  public getDependentDependencies(dependencyName: DependencyName): BaseDependency[] {
    const result: BaseDependency[] = [];
    const visited = new Set<DependencyName>();

    const collect = (name: DependencyName) => {
      if (visited.has(name)) return;
      visited.add(name);

      const childConfig = this.config.childrens?.find(c => c.name === name);
      if (childConfig?.dependentList) {
        childConfig.dependentList.forEach((depName: string) => {
          const dep = this.dependencies.get(depName as DependencyName);
          if (dep) {
            result.push(dep);
          }
          collect(depName as DependencyName); // Recursive
        });
      }
    };

    collect(dependencyName);
    return result;
  }

  getDependents(dependencyName: DependencyName): BaseDependency[] {
    const result: BaseDependency[] = [];
    for (const [name, dep] of this.dependencies) {
      const deps = this.getDependentDependencies(name);
      if (deps.some(d => d.name === dependencyName)) {
        result.push(dep);
      }
    }
    return result;
  }

  protected async dependencyInit(dependency: BaseDependency): Promise<void> {
    if (!dependency.isInit) {
      await dependency.init();
    }
  }

  protected async dependencyInitAll(): Promise<void> {
    const promises = Array.from(this.dependencies.values()).map(dep => this.dependencyInit(dep));
    await Promise.all(promises);
  }

  protected async dependencyDestroy(dependency: BaseDependency): Promise<void> {
    if (dependency.isInit) {
      await dependency.destroy();
    }
  }

  protected async dependencyDestroyAll(): Promise<void> {
    const promises = Array.from(this.dependencies.values()).map(dep => this.dependencyDestroy(dep));
    await Promise.all(promises);
  }

  protected async dependencyStart(dependency: BaseDependency): Promise<void> {
    if (dependency.isWorking) return;

    const deps = this.getDependentDependencies(dependency.name as DependencyName);
    if (deps.every(d => d.isWorking)) {
      await dependency.start();
    }
  }

  protected async dependencyStartAll(): Promise<void> {
    let hasChanges = true;
    while (hasChanges) {
      hasChanges = false;
      for (const dep of this.dependencies.values()) {
        if (!dep.isWorking) {
          const deps = this.getDependentDependencies(dep.name as DependencyName);
          if (deps.every(d => d.isWorking)) {
            await dep.start();
            hasChanges = true;
          }
        }
      }
    }
  }

  protected async dependencyStop(dependency: BaseDependency): Promise<void> {
    if (!dependency.isWorking) return;

    // Stop dependents first
    const dependents = this.getDependents(dependency.name as DependencyName);
    for (const dep of dependents) {
      await this.dependencyStop(dep);
    }

    await dependency.stop();
  }

  protected async dependencyStopAll(): Promise<void> {
    // Stop in reverse dependency order
    const toStop = Array.from(this.dependencies.values()).filter(dep => dep.isWorking);
    for (const dep of toStop) {
      await this.dependencyStop(dep);
    }
  }

  protected async dependencyPause(dependency: BaseDependency): Promise<void> {
    if (!dependency.isWorking) return;

    // Pause dependents first
    const dependents = this.getDependents(dependency.name as DependencyName);
    for (const dep of dependents) {
      await this.dependencyPause(dep);
    }

    await dependency.pause();
  }

  protected async dependencyPauseAll(): Promise<void> {
    const toPause = Array.from(this.dependencies.values()).filter(dep => dep.isWorking);
    for (const dep of toPause) {
      await this.dependencyPause(dep);
    }
  }

  protected async dependencyUnpause(dependency: BaseDependency): Promise<void> {
    if (dependency.isPaused) {
      await dependency.pause(); // Since pause toggles
    }
  }

  protected async dependencyUnpauseAll(): Promise<void> {
    const promises = Array.from(this.dependencies.values())
      .filter(dep => dep.isPaused)
      .map(dep => this.dependencyUnpause(dep));
    await Promise.all(promises);
  }

  protected async onInit(): Promise<void> {
    await this.dependencyInitAll();
  }

  protected async onDestroy(): Promise<void> {
    await this.dependencyDestroyAll();
  }

  protected async onStart(): Promise<void> {
    await this.dependencyStartAll();
  }

  protected async onStop(): Promise<void> {
    await this.dependencyStopAll();
  }

  protected async onPause(): Promise<void> {
    await this.dependencyPauseAll();
  }

  protected async onUnpause(): Promise<void> {
    await this.dependencyUnpauseAll();
  }
}