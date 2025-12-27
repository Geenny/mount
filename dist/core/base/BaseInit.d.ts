import { BaseConfig } from './BaseConfig';
import { ConfigType } from './types';
export declare abstract class BaseInit extends BaseConfig {
    protected _isInit: boolean;
    constructor(config: ConfigType);
    get isInit(): boolean;
    init(): this;
    destroy(): void;
    protected onInit(): void;
    protected onDestroy(): void;
}
