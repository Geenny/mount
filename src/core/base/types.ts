type ConfigType = Record<string, any>;

type IndentifyConfigType = { ID?: number, name: string };

type PromiseStructType = { promise: Promise<any>, method: PromiseMethodType};
type PromiseMethodType = { resolve: () => void, reject?: ( error: any ) => void };

export { ConfigType, IndentifyConfigType, PromiseStructType, PromiseMethodType };