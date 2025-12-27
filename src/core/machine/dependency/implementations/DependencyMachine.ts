import { BaseDependencyMachine } from '../base/BaseDependencyMachine';
import { DependencyMachineConfigType, DependencyConfigType } from 'config/types';
import { DependencyName } from 'core/dependency/enums';
import { dependencyConfig } from 'config/config.machine.dependency';
import { DependencyInit } from 'core/dependency/implementations/DependencyInit';
import { DependencyDispatcher } from 'core/dependency/implementations/DependencyDispatcher';
import { DependencyStats } from 'core/dependency/implementations/DependencyStats';
import { DependencyStorage } from 'core/dependency/implementations/DependencyStorage';

export class DependencyMachine extends BaseDependencyMachine {
  constructor(config: DependencyMachineConfigType = dependencyConfig) {
    super(config);
    // Add initial dependencies from config
    if (config.childrens) {
      this.addAll(config.childrens);
    }
  }

  // Override add to create specific instances
  add(dependencyConfig: DependencyConfigType): void {
    if (this.dependencies.has(dependencyConfig.name)) {
      return;
    }
    // Create specific dependency based on name
    let dependency: any;
    switch (dependencyConfig.name) {
      case DependencyName.DEPENDENCY_INIT:
        dependency = new DependencyInit(dependencyConfig, this);
        break;
      case DependencyName.DEPENDENCY_DISPATCHER:
        dependency = new DependencyDispatcher(dependencyConfig, this);
        break;
      case DependencyName.DEPENDENCY_STATS:
        dependency = new DependencyStats(dependencyConfig, this);
        break;
      case DependencyName.DEPENDENCY_STORAGE:
        dependency = new DependencyStorage(dependencyConfig, this);
        break;
      // Add other cases
      default:
        // For now, skip unknown
        break;
    }
    if (dependency) {
      this.dependencies.set(dependencyConfig.name, dependency);
    }
  }
}