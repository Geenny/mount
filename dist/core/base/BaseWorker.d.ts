import { BaseInit } from './BaseInit';
export declare abstract class BaseWorker extends BaseInit {
    protected _isRunning: boolean;
    protected _isPaused: boolean;
    get isRunning(): boolean;
    get isPaused(): boolean;
    get isWorking(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(paused?: boolean | undefined): Promise<void>;
    destroy(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onStop(): Promise<void>;
    protected onPause(): Promise<void>;
    protected onUnpause(): Promise<void>;
}
