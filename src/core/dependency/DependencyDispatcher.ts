import { BaseDependency } from 'core/dependency/base/BaseDependency';
import { DependencyConfigType } from 'config/types';
import { Subject, Subscription } from 'rxjs';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';
import { IDispatcher } from 'core/base/interface';
import { DispatcherEmitType } from './types';

export class DependencyDispatcher extends BaseDependency implements IDispatcher {
  private streams: Map<string, Subject<any>> = new Map();
  private subscriptionsByInstance: Map<IDispatcher, Map<string, Subscription>> = new Map();

  constructor(config: DependencyConfigType, machine: IBaseDependencyMachine) {
    super(config, machine);
  }

  subscribe(instance: IDispatcher, type: string, observer: (value: DispatcherEmitType) => void): void {
    if (!this.subscriptionsByInstance.has(instance)) {
      this.subscriptionsByInstance.set(instance, new Map());
    }
    const instSubs = this.subscriptionsByInstance.get(instance)!;
    if (!instSubs.has(type)) {
      if (!this.streams.has(type)) {
        this.streams.set(type, new Subject<DispatcherEmitType>());
      }
      const stream = this.streams.get(type)!;
      const subscription = stream.subscribe(observer);
      instSubs.set(type, subscription);
    }
  }

  unsubscribe(instance: IDispatcher): void {
    const instSubs = this.subscriptionsByInstance.get(instance);
    if (instSubs) {
      for (const sub of instSubs.values()) {
        sub.unsubscribe();
      }
      this.subscriptionsByInstance.delete(instance);
    }
  }

  dispatch(type: string, value: DispatcherEmitType): void {
    this.cleanDeadInstances();
    const stream = this.streams.get(type);
    if (stream) {
      stream.next(value);
    }
  }

  private cleanDeadInstances(): void {
    for (const [instance, instSubs] of this.subscriptionsByInstance) {
      // Assuming instance has isDestroyed property or similar
      if ((instance as any).isDestroyed) {
        for (const sub of instSubs.values()) {
          sub.unsubscribe();
        }
        this.subscriptionsByInstance.delete(instance);
      }
    }
  }

  private destroyStreams(): void {
    for (const [type, stream] of this.streams) {
      stream.complete();
    }
    this.streams.clear();

    for (const instSubs of this.subscriptionsByInstance.values()) {
      for (const sub of instSubs.values()) {
        sub.unsubscribe();
      }
    }
    this.subscriptionsByInstance.clear();
  }

  // Specific logic for dispatcher dependency
  async onStart(): Promise<void> {
    await super.onStart();
    // Streams created on demand
  }

  async onStop(): Promise<void> {
    this.destroyStreams();
    await super.onStop();
  }
}