import { Subscription, Subject } from 'rxjs';

export interface IDependencyDispatcher {
  subscribe(observer: (value: any) => void): Subscription;
  unsubscribe(subscription: Subscription): void;
  dispatch(value: any): void;
}