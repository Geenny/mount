
import { STYLE_COMPONENTS, STYLE_DEFAULT, STYLE_COMPONENT } from "./OutputStyles";

class Output {
    private styleByCallerGet(caller: any): string {
        // if ( caller && caller.constructor.name === 'Components' ) return STYLE_COMPONENTS;
        // if ( caller && caller.constructor.name.indexOf('Component') >= 0 ) return STYLE_COMPONENT;
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

const output = new Output();

export { output, Output };