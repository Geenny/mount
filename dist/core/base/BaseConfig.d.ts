import { ConfigType } from './types';
export declare abstract class BaseConfig {
    protected config: ConfigType;
    get isConfig(): boolean;
    get isConfigApproved(): boolean;
    configure(config?: ConfigType): void;
    unconfigure(): void;
}
