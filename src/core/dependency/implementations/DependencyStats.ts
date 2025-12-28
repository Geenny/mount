import { DependencyConfigType } from 'config/types';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
import { BaseDependencyDispatch } from '../base/BaseDependencyDispatch';

export class DependencyStats extends BaseDependencyDispatch {

    constructor(config: DependencyConfigType, machine: IBaseDependencyMachine) {
        super(config, machine);
    }

    // Specific logic for stats dependency
    async onStart(): Promise<void> {
        await super.onStart();
    }
}