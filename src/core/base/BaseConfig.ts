import { ConfigType } from './types';

const CONFIG_DEFAULT: ConfigType = { };

export abstract class BaseConfig {
    protected config?: ConfigType;

    get isConfig(): boolean {
        return !!this.config;
    }

    get isConfigApproved(): boolean {
        return this.isConfig;
    }

    configure( config: ConfigType | undefined ): void {
        this.config = config || CONFIG_DEFAULT;
    }

    unconfigure(): void {
        this.config = undefined;
    }
}