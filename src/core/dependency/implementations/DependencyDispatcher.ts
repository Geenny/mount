import { BaseDependency } from '../base/BaseDependency';
import { DependencyConfigType } from 'config/types';
import { Subject, Subscription } from 'rxjs';
import { IDependencyDispatcher } from './interface';
import { IBaseDependencyMachine } from 'core/machine/dependency/base/interface';

export class DependencyDispatcher extends BaseDependency implements IDependencyDispatcher {
  private masterStream: Subject<any> | null = null;

  constructor(config: DependencyConfigType, machine: IBaseDependencyMachine) {
    super(config, machine);
  }

  private createMasterStream(): void {
    this.masterStream = new Subject<any>();
  }

  private destroyMasterStream(): void {
    if (this.masterStream) {
      this.masterStream.complete();
      this.masterStream = null;
    }
  }

  subscribe(observer: (value: any) => void): Subscription {
    if (!this.masterStream) {
      throw new Error('Master stream not initialized');
    }
    return this.masterStream.subscribe(observer);
  }

  unsubscribe(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  dispatch(value: any): void {
    if (!this.masterStream) {
      throw new Error('Master stream not initialized');
    }
    this.masterStream.next(value);
  }

  // Specific logic for dispatcher dependency
  async onStart(): Promise<void> {
    await super.onStart();
    this.createMasterStream();
  }

  async onStop(): Promise<void> {
    this.destroyMasterStream();
    await super.onStop();
  }
}