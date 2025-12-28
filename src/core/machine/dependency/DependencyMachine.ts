import { BaseDependencyMachine } from 'core/machine/dependency/base/BaseDependencyMachine';
import { DependencyMachineConfigType, DependencyConfigType } from 'config/types';

export class DependencyMachine extends BaseDependencyMachine {
  constructor(config: DependencyMachineConfigType) {
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
    // Create dependency using instance from config
    if (dependencyConfig.instance) {
      const DependencyClass = dependencyConfig.instance;
      const dependency = new DependencyClass(dependencyConfig, this);
      this.dependencies.set(dependencyConfig.name, dependency);
    }
  }
}