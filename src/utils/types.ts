
type PromiseMethodType< T > = { resolve: ( value: T ) => void, reject?: ( error: any ) => void };
type PromiseStructType< T > = { promise: Promise< T >, method: PromiseMethodType< T > };

export { PromiseStructType, PromiseMethodType };