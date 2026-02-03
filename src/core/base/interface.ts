import { ConfigType } from "./types";

interface IDispatcher {
  subscribe( instance: IDispatcher, type: string, observer: (value: any) => void ): void;
  unsubscribe( instance: IDispatcher ): void;
  dispatch( type: string, value: any ): void;
}

interface IWorker {

  readonly isWorking: boolean;

  readonly isPaused: boolean;

  readonly isRunning: boolean;

  init( config: ConfigType ): Promise<void>;

  destroy(): Promise<void>;

  start(): Promise<void>;

  stop(): Promise<void>;

  pause( paused?: boolean): Promise<void>;

}

export { IDispatcher, IWorker };