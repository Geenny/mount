declare class Output {
    private styleByCallerGet;
    log(caller: any, ...args: any[]): void;
    warn(caller: any, ...args: any[]): void;
    error(caller: any, ...args: any[]): void;
}
declare const output: Output;
export { output, Output };
