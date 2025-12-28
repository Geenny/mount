import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
export declare class BaseDependencyDispatch extends BaseDependency {
    private _dispatcher?;
    constructor(config: DependencyConfigType, machine: IBaseDependencyMachine);
    dispatch(event: any): void;
    subscribe(callback: (event: any) => void): void;
    unsubscribe(subscription: any): void;
    protected bindDispatcher(): void;
    protected unbindDispatcher(): void;
    onStart(): Promise<void>;
    protected onDestroy(): Promise<void>;
}
