import { ConfigType } from './types';

const CONFIG_DEFAULT: ConfigType = { };

export abstract class BaseConfig {

    protected config: ConfigType = CONFIG_DEFAULT;

    /**
     * Override this method to add custom validation logic for the config object
     */
    get isConfigApproved(): boolean {
        return true;
    }

    /**
     * Set the config as RAW data
     * Or will be setted CONFIG_DEFAULT
     */
    configure( config?: ConfigType ): void {
        this.config = config || CONFIG_DEFAULT;
    }

    /**
     * Reset the config to default state (CONFIG_DEFAULT)
     */
    unconfigure(): void {
        this.config = CONFIG_DEFAULT;
    }

}