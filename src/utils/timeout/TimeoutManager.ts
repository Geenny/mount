import { storage } from "utils/index";

const TIMEOUT_MANAGER_KEY = 'timeoutManager';

export class TimeoutManager {

    protected map: Map< string, NodeJS.Timeout >;

    constructor() {
        let map: Map< string, NodeJS.Timeout > = storage.get( TIMEOUT_MANAGER_KEY );
        if ( !map ) {
            map = new Map();
            storage.set( TIMEOUT_MANAGER_KEY, map );
        }
        this.map = map;
    }

    get( key: string ): NodeJS.Timeout | undefined {
        return this.map.get( key );
    }

    set( key: string, callback: Function, delay: number, ...args: any[] ): NodeJS.Timeout {
        const timeout = setTimeout( () => {
            this.remove( key );
            callback( ...args );
        }, delay );
        this.add( key, timeout );
        return timeout;
    }

    clear( key: string ): void {
        this.remove( key );
    }

    protected add( key: string, timeout: NodeJS.Timeout ): void {
        this.map.set( key, timeout );
    }
    protected remove( key: string ): void {
        const timeout = this.map.get( key );
        if ( !timeout ) return;
        clearTimeout( timeout );
        this.map.delete( key );
    }

}