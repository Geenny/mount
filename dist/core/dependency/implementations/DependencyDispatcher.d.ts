import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';
import { Subscription } from 'rxjs';
import { IDependencyDispatcher } from './interface';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
export declare class DependencyDispatcher extends BaseDependency implements IDependencyDispatcher {
    private masterStream;
    constructor(config: DependencyConfigType, machine: IBaseDependencyMachine);
    private createMasterStream;
    private destroyMasterStream;
    subscribe(observer: (value: any) => void): Subscription;
    unsubscribe(subscription: Subscription): void;
    dispatch(value: any): void;
    onStart(): Promise<void>;
    onStop(): Promise<void>;
}
