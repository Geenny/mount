export class Output {
    private styles: Record<string, string> = {
        App: 'color: green',
        default: 'color: black'
    };

    log(caller: any, ...args: any[]): void {
        const style = this.styles[caller.constructor.name] || this.styles.default;
        console.log(`%c[${caller.constructor.name}]`, style, ...args);
    }

    warn(caller: any, ...args: any[]): void {
        const style = this.styles[caller.constructor.name] || this.styles.default;
        console.warn(`%c[${caller.constructor.name}]`, style, ...args);
    }

    error(caller: any, ...args: any[]): void {
        const style = this.styles[caller.constructor.name] || this.styles.default;
        console.error(`%c[${caller.constructor.name}]`, style, ...args);
    }
}

export const output = new Output();