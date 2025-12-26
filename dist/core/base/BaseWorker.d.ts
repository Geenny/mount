import { BaseInit } from './BaseInit';
import { ConfigType } from './types';
export declare abstract class BaseWorker extends BaseInit {
    private _isRunning;
    private _isPaused;
    constructor(config: ConfigType);
    protected get isRunning(): boolean;
    protected get isPaused(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
}
