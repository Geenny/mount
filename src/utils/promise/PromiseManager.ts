import { PromiseMethodType, PromiseStructType } from "utils/types";
import { storage } from "utils/index";

const PROMISE_MANAGER_KEY = 'promiseManager';

export class PromiseManager {

    protected map: Map< string, PromiseStructType< any > >;

    constructor() {
        let map: Map< string, PromiseStructType< any > > = storage.get( PROMISE_MANAGER_KEY );
        if ( !map ) {
            map = new Map();
            storage.set( PROMISE_MANAGER_KEY, map );
        }
        this.map = map;
    }

    create< T >( key: string, executeMethod?: Function ): Promise< T > {
        const methods: PromiseMethodType< T > = { resolve: ( value: T ) => {} };
        const promise = new Promise< T >( ( resolve, reject ) => {
            methods.resolve = ( value: T ) => {
                this.remove( key );
                resolve( value );
            };
            methods.reject = ( error: any ) => {
                this.remove( key );
                reject( error );
            };

            executeMethod?.();
        });
        
        const struct: PromiseStructType< T > = { promise, method: methods };

        this.add( key, struct );

        return promise;
    }

    get< T >( key: string ): Promise< T > | undefined {
        const struct = this.map.get( key );
        if ( !struct ) return undefined;
        return struct.promise;
    }

    resolve< T >( key: string, value?: T ): void {
        const struct = this.map.get( key );
        if ( !struct ) return;
        struct.method.resolve( value );
    }

    reject( key: string, error: any ): void {
        const struct = this.map.get( key );
        if ( !struct ) return;
        struct.method.reject?.( error );
    }

    protected add< T >( key: string, struct: PromiseStructType< T > ): void {
        this.map.set( key, struct );
        console.log( 'PromiseStructures: added', key, this.map.size );
    }
    protected remove( key: string ): void {
        this.map.delete( key );
        console.log( 'PromiseStructures: removed', key, this.map.size );
    }

}