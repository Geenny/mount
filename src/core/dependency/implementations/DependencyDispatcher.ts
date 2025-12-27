import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';

export class DependencyDispatcher extends BaseDependency {
  constructor(config: DependencyConfigType, machine: any) {
    super(config, machine);
  }

  // Specific logic for dispatcher dependency
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