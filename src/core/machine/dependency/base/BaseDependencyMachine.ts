import { BaseWorker } from 'core/base/BaseWorker';
import { DependencyMachineConfigType, DependencyConfigType } from 'config/types';
import { DependencyName } from 'core/dependency/enums';
import { BaseDependency } from 'core/dependency/base/BaseDependency';
import { output } from 'utils/output/Output';

export abstract class BaseDependencyMachine extends BaseWorker {
  protected dependencies: Map<DependencyName, BaseDependency> = new Map();

  constructor(config: DependencyMachineConfigType) {
    super(config);
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

  getDependentDependencies(dependency: BaseDependency): BaseDependency[] {
    // Iterative collection of dependencies
    const result: BaseDependency[] = [];
    // Placeholder implementation
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
    if (!dependency.isWorking) {
      // Check if all dependencies are working
      // Placeholder
      await dependency.start();
    }
  }

  protected async dependencyStartAll(): Promise<void> {
    // Start dependencies in order
    for (const dep of this.dependencies.values()) {
      await this.dependencyStart(dep);
    }
  }

  protected async dependencyStop(dependency: BaseDependency): Promise<void> {
    if (dependency.isWorking) {
      // Stop dependents
      await dependency.stop();
    }
  }

  protected async dependencyStopAll(): Promise<void> {
    // Stop in reverse order
    const deps = Array.from(this.dependencies.values()).reverse();
    for (const dep of deps) {
      await this.dependencyStop(dep);
    }
  }

  protected async dependencyPause(dependency: BaseDependency): Promise<void> {
    if (dependency.isWorking) {
      await dependency.pause();
    }
  }

  protected async dependencyPauseAll(): Promise<void> {
    const promises = Array.from(this.dependencies.values())
      .filter(dep => dep.isWorking)
      .map(dep => this.dependencyPause(dep));
    await Promise.all(promises);
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