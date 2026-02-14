import { ConfigType } from "core/base/types";
import { IController, IModel } from "./interface";

export class BaseModel implements IModel {

    protected controller?: IController;
    
    /**
     * Reactive data storage with Proxy
     * Automatically triggers onModelChange when properties are modified
     */
    protected data: Record< string, any >;

    constructor() {
        this.data = new Proxy( {} as Record< string, any >, {
            set: ( target: Record< string, any >, property, value ) => {
                const key = String(property);
                // Оптимизация: не записываем то же самое значение
                if ( target[ key ] === value ) return true;
                
                target[ key ] = value;
                this.controller?.onModelChange( key, value );
                return true;
            }
        });
    }

    controllerSet( controller: IController ): void {
        this.controller = controller;
    }

    configurate( config?: ConfigType ): void {
        if ( config ) {
            for ( const key in config ) {
                this.data[ key ] = config[ key ];
            }
        }
    }

    unconfigurate(): void {
        this.data = { };
    }

}