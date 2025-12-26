import { Utils } from '../Utils';
import { outputStyles } from '../../config/config.output';

export class Output extends Utils {
    private isProduction: boolean;
    private styles: Record<string, string>;

    constructor(config: { id: string; name: string; isProduction: boolean; styles: Record<string, string> }) {
        super({ ID: config.id, name: config.name });
        this.isProduction = config.isProduction;
        this.styles = config.styles;
    }

    private getStyle(caller: any): string {
        return this.styles[caller.constructor.name] || this.styles.default;
    }

    log(caller: any, ...args: any[]): void {
        if (!this.isProduction) {
            console.log(`%c[${caller.constructor.name}]`, this.getStyle(caller), ...args);
        }
    }

    warn(caller: any, ...args: any[]): void {
        if (!this.isProduction) {
            console.warn(`%c[${caller.constructor.name}]`, this.getStyle(caller), ...args);
        }
    }

    error(caller: any, ...args: any[]): void {
        if (!this.isProduction) {
            console.error(`%c[${caller.constructor.name}]`, this.getStyle(caller), ...args);
        }
    }
}

const output = new Output({ id: 'output', name: 'Output', isProduction: false, styles: outputStyles });
export { output };