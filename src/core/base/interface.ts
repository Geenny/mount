export interface IDispatcher {
  subscribe(instance: IDispatcher, type: string, observer: (value: any) => void): void;
  unsubscribe(instance: IDispatcher): void;
  dispatch(type: string, value: any): void;
}