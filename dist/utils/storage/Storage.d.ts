declare class Storage {
    protected data: Map<string, any>;
    isData(name: string): boolean;
    set(name: string, data: any): void;
    get(name: string): any | undefined;
}
declare const storage: Storage;
export { storage, Storage };
