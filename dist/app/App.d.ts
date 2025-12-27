import { BaseWorker } from 'core/base/BaseWorker';
import { ConfigType } from 'core/base/types';
export declare class App extends BaseWorker {
    constructor(config: ConfigType);
    init(): Promise<void>;
    destroy(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
}
