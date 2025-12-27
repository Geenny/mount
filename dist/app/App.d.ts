import { BaseWorker } from 'core/base/BaseWorker';
import { ConfigType } from 'core/base/types';
export declare class App extends BaseWorker {
    private dependencyMachine?;
    constructor(config: ConfigType);
    protected onInit(): Promise<void>;
    protected onDestroy(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onStop(): Promise<void>;
    protected onPause(): Promise<void>;
    protected onUnpause(): Promise<void>;
}
