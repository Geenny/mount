import { ConfigType } from './types';
export declare abstract class BaseConfig {
    protected config: ConfigType;
    constructor(config: ConfigType);
    get isConfig(): boolean;
    configure(config: ConfigType): void;
}
