import { ConfigType } from './types';

export abstract class BaseConfig {
    protected config: ConfigType;

    constructor(config: ConfigType) {
        this.config = config;
    }

    get isConfig(): boolean {
        return !!this.config;
    }

    configure(config: ConfigType): void {
        this.config = config;
    }
}