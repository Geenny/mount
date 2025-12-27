import { BaseConfig } from './BaseConfig';
import { ConfigType } from './types';
export declare abstract class BaseInit extends BaseConfig {
    protected _isInit: boolean;
    constructor(config: ConfigType);
    get isInit(): boolean;
    init(): Promise<void>;
    destroy(): Promise<void>;
    protected onInit(): Promise<void>;
    protected onDestroy(): Promise<void>;
}
