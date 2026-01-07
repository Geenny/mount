import { ConfigType } from './types';

export abstract class BaseConfig {
    protected config?: ConfigType;

    get isConfig(): boolean {
        return !!this.config;
    }

    get isConfigApproved(): boolean {
        return this.isConfig;
    }

    configure(config: ConfigType): void {
        this.config = config;
    }

    unconfigure(): void {
        this.config = undefined;
    }
}