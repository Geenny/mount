import { DependencyConfigType } from 'config/types';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
import { BaseDependencyDispatch } from '../base/BaseDependencyDispatch';

export class DependencyStorage extends BaseDependencyDispatch {

  constructor(config: DependencyConfigType, machine: IBaseDependencyMachine) {
    super(config, machine);
  }

  // Specific logic for storage dependency
  async onStart(): Promise<void> {
    await super.onStart();
  }
}