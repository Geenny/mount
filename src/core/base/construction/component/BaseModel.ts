import { ConfigType } from "core/base/types";
import { BaseController } from "./BaseController";
import { IControllerHolder } from "./interface";

export class BaseModel implements IControllerHolder {

    protected controller?: BaseController;

    config: ConfigType = { };

    controllerSet( controller: BaseController ): void {
        this.controller = controller;
    }

    configurate( config?: ConfigType ): void {
        if ( config ) {
            for ( const key in config ) {
                this.config[key] = config[key];
            }
        }
    }

    set( key: string, value: any ): void {
        // Оптимизация: не записываем то же самое значение
        if ( !key || this.config[ key ] === value) return;

        this.config[ key ] = value;

        this.controller?.onModelChange( key, value );
    }

    get( key: string ): any {
        return this.config[ key ];
    }

}