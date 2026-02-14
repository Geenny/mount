import { ConfigType } from "core/base/types";
import { BaseController } from "./BaseController";
import { IController, IModel } from "./interface";

export class BaseModel implements IModel {

    protected controller?: IController;

    config: ConfigType = { };

    controllerSet( controller: IController ): void {
        this.controller = controller;
    }

    configurate( config?: ConfigType ): void {
        if ( config ) {
            for ( const key in config ) {
                this.config[key] = config[key];
            }
        }
    }

    unconfigurate(): void {
        this.config = { };
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