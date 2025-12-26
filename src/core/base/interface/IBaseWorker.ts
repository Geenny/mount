export interface IBaseWorker {
  start(): Promise<void>;
  stop(): Promise<void>;
}