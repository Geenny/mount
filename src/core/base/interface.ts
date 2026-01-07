// interface IDependency {
//   add(dependency: IDependency): void; // Add dependent dependency
//   remove(dependency: IDependency): void; // Remove dependent dependency
//   removeAll(): void; // Remove all dependent dependencies, just for destroy
// }

interface IDispatcher {
  subscribe(instance: IDispatcher, type: string, observer: (value: any) => void): void;
  unsubscribe(instance: IDispatcher): void;
  dispatch(type: string, value: any): void;
}

export { /* IDependency, */ IDispatcher };