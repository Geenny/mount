import { App } from 'app/App';
declare global {
    interface Window {
        app?: App;
    }
}
export declare class Entry {
    private app;
    constructor();
    start(): Promise<void>;
}
