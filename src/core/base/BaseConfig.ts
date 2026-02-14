import { ConfigType } from './types';

const CONFIG_DEFAULT: ConfigType = { };

export abstract class BaseConfig {
    protected config: ConfigType = CONFIG_DEFAULT;

    get isConfig(): boolean {
        return this.config !== CONFIG_DEFAULT;
    }

    get isConfigApproved(): boolean {
        return this.isConfig;
    }

    configure( config?: ConfigType ): void {
        this.config = config || CONFIG_DEFAULT;
    }

    unconfigure(): void {
        this.config = CONFIG_DEFAULT;
    }
}