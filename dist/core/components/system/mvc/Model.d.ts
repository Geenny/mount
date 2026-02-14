import { BaseModel } from "core/base/construction/component/BaseModel";
import { ISystemModel } from "../interface";
import { SystemVisibleDataType, SystemKeyboardDataType, SystemResizeDataType } from "../types";
export declare class Model extends BaseModel implements ISystemModel {
    get visibility(): SystemVisibleDataType;
    set visibility(value: SystemVisibleDataType | undefined);
    get keyboard(): SystemKeyboardDataType | undefined;
    set keyboard(value: SystemKeyboardDataType | undefined);
    get resize(): SystemResizeDataType | undefined;
    set resize(value: SystemResizeDataType | undefined);
}
