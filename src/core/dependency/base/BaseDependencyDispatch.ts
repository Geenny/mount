import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
import { DependencyName } from '../enums';
import { IDispatcher } from 'core/base/interface';

export class BaseDependencyDispatch extends BaseDependency {
    protected dispatcher?: IDispatcher;
    private subscriptions: Map<string, ((event: any) => void)[]> = new Map();

    constructor(config: DependencyConfigType, machine: IBaseDependencyMachine) {
        super(config, machine);
    }

    protected dispatch(type: string, event: any): void {
        if (!this.dispatcher) return;
        this.dispatcher.dispatch(type, event);
    }

    protected subscribe(type: string, callback: (event: any) => void): void {
        if (!this.dispatcher) return;
        this.dispatcher.subscribe(this as any, type, callback);
        if (!this.subscriptions.has(type)) {
            this.subscriptions.set(type, []);
        }
        this.subscriptions.get(type)!.push(callback);
    }

    protected unsubscribe(type: string, callback: (event: any) => void): void {
        if (!this.dispatcher) return;
        // Note: Since unsubscribe now takes instance, we can't unsubscribe individual callbacks easily
        // This might need adjustment
    }

    //
    // BIND DISPATCHER
    //
    protected bindDispatcher(): void {
        const dependency = this.machine.getDependentDependencyByName(DependencyName.DEPENDENCY_DISPATCHER);
        this.dispatcher = dependency as unknown as IDispatcher;
    }
    protected unbindDispatcher(): void {
        this.dispatcher = undefined;
    }

    // Specific logic for stats dependency
    async onStart(): Promise<void> {
        this.bindDispatcher();
        await super.onStart();
    }

    protected async onDestroy(): Promise<void> {
        if (this.dispatcher) {
            this.dispatcher.unsubscribe(this as any);
        }
        this.subscriptions.clear();
        this.unbindDispatcher();
        await super.onDestroy();
    }
}