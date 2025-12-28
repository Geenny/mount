import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';

export class DependencyInit extends BaseDependency {
  constructor(config: DependencyConfigType, machine: IBaseDependencyMachine) {
    super(config, machine);
  }

  // Specific logic for init dependency
  async onStart(): Promise<void> {
    // Just for demonstration, simulate some async init work
    return new Promise((resolve) => {
        setTimeout(() => {
            super.onStart();
            resolve();
        }, 500);
    });
  }
}