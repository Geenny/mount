import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
import { IDependencyDispatcher } from '../implementations/interface';
import { DependencyName } from '../enums';
import { Subscribable } from 'rxjs';

export class BaseDependencyDispatch extends BaseDependency {
    private _dispatcher?: IDependencyDispatcher;

    constructor(config: DependencyConfigType, machine: IBaseDependencyMachine) {
        super(config, machine);
    }

    dispatch( event: any ) {
        if (!this._dispatcher) return;
        this._dispatcher.dispatch(event);
    }

    subscribe( callback: (event: any) => void ): void {
        if (!this._dispatcher) return;
        this._dispatcher.subscribe(callback);
    }

    unsubscribe( subscription: any ) {
        if (!this._dispatcher) return;
        this._dispatcher.unsubscribe(subscription);
    }


    //
    // BIND DISPATCHER
    //
    protected bindDispatcher(): void {
        const dependency = this.machine.getDependentDependencyByName(DependencyName.DEPENDENCY_DISPATCHER);
        this._dispatcher = dependency as unknown as IDependencyDispatcher;
    }
    protected unbindDispatcher(): void {
        this._dispatcher = undefined;
    }


    // Specific logic for stats dependency
    async onStart(): Promise<void> {
        this.bindDispatcher();
        await super.onStart();
    }

    protected async onDestroy(): Promise<void> {
        this._dispatcher = undefined;
    }
}