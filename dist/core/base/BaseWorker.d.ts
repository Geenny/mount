import { BaseInit } from './BaseInit';
import { ConfigType } from './types';
export declare abstract class BaseWorker extends BaseInit {
    protected _isRunning: boolean;
    protected _isPaused: boolean;
    constructor(config: ConfigType);
    get isRunning(): boolean;
    get isPaused(): boolean;
    get isWorking(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onStop(): Promise<void>;
    protected onPause(): Promise<void>;
}
