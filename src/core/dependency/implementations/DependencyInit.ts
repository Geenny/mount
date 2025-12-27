import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';

export class DependencyInit extends BaseDependency {
  constructor(config: DependencyConfigType, machine: any) {
    super(config, machine);
  }

  // Specific logic for init dependency
}