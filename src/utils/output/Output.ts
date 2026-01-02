
import { STYLE_APPLICATION, STYLE_DEFAULT, STYLE_DEPENDENCY } from "./OutputStyles";

export class Output {
    private styleByCallerGet(caller: any): string {
        if ( caller && caller.constructor.name === 'App' ) return STYLE_APPLICATION;
        if ( caller && caller.constructor.name.indexOf('Dependency') === 0 ) return STYLE_DEPENDENCY;
        return STYLE_DEFAULT;
    }

    log(caller: any, ...args: any[]): void {
        const style = this.styleByCallerGet(caller);
        console.log(`%c[${caller.constructor.name}]`, style, ...args);
    }

    warn(caller: any, ...args: any[]): void {
        const style = this.styleByCallerGet(caller);
        console.warn(`%c[${caller.constructor.name}]`, style, ...args);
    }

    error(caller: any, ...args: any[]): void {
        const style = this.styleByCallerGet(caller);
        console.error(`%c[${caller.constructor.name}]`, style, ...args);
    }
}

export const output = new Output();