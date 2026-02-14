import { BaseConfig } from './BaseConfig';
import { ConfigType } from './types';
export declare abstract class BaseInit extends BaseConfig {
    protected _isInit: boolean;
    get isInit(): boolean;
    get isDestroyed(): boolean;
    init(config?: ConfigType): Promise<void>;
    destroy(): Promise<void>;
    protected onInit(): Promise<void>;
    protected onDestroy(): Promise<void>;
}
