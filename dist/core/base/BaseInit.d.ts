import { BaseConfig } from './BaseConfig';
import { ConfigType } from './types';
export declare abstract class BaseInit extends BaseConfig {
    constructor(config: ConfigType);
    init(): Promise<void>;
    destroy(): Promise<void>;
}
