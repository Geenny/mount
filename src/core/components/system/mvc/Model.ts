import { BaseModel } from "core/base/construction/component/BaseModel";
import { ISystemModel } from "../interface";
import { SystemVisibleDataType, SystemKeyboardDataType, SystemResizeDataType } from "../types";

export class Model extends BaseModel implements ISystemModel {

    get visibility(): SystemVisibleDataType {
        return this.data.visibility || false;
    }
    set visibility(value: SystemVisibleDataType | undefined) {
        this.data.visibility = value;
    }

    get keyboard(): SystemKeyboardDataType | undefined {
        return this.data.keyboard;
    }
    set keyboard(value: SystemKeyboardDataType | undefined) {
        this.data.keyboard = value;
    }

    get resize(): SystemResizeDataType | undefined {
        return this.data.resize;
    }
    set resize(value: SystemResizeDataType | undefined) {
        this.data.resize = value;
    }

}