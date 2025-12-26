import { IBaseConfig } from "./IBaseConfig";
export interface IBaseInit extends IBaseConfig {
    init(): Promise<void>;
    destroy(): Promise<void>;
}
