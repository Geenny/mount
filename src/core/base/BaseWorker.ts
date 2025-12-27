import { BaseInit } from './BaseInit';
import { ConfigType } from './types';

export abstract class BaseWorker extends BaseInit {
  protected _isRunning = false;
  protected _isPaused = false;

  constructor(config: ConfigType) {
    super(config);
  }

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public get isPaused(): boolean {
    return this._isPaused;
  }

  public get isWorking(): boolean {
    return this._isRunning && !this._isPaused;
  }

  async start(): Promise<void> {
    if (this._isRunning)
        await this.stop();
    
    await this.onStart();

    this._isRunning = true;
    this._isPaused = false;
  }

  async stop(): Promise<void> {
    await this.onStop();

    this._isRunning = false;
    this._isPaused = false;
  }

  async pause(): Promise<void> {
    if (!this.isWorking) return;
    // Логика паузы
    this._isPaused = true;

    await this.onPause();
  }

  protected async onStart(): Promise<void> {
    // Логика при старте
  }
  protected async onStop(): Promise<void> {
    // Логика при остановке
  }
  protected async onPause(): Promise<void> {
    // Логика при паузе
  }
}