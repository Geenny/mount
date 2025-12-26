import { BaseWorker } from '../core/base/BaseWorker';
export declare class App extends BaseWorker {
    constructor();
    init(): Promise<void>;
    destroy(): Promise<void>;
    start(): Promise<void>;
}
