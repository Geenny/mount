import { BaseWorker } from '../core/base/BaseWorker';
export declare class App extends BaseWorker {
    constructor();
    init(): this;
    destroy(): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
}
