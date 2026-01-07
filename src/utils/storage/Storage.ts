class Storage {
    protected data: Map<string, any> = new Map();

    isData(name: string): boolean {
        return this.data.has(name);
    }

    set(name: string, data: any): void {
        this.data.set(name, data);
    }

    get(name: string): any | undefined {
        return this.data.get(name);
    }
}

const storage = new Storage();

export { storage, Storage };