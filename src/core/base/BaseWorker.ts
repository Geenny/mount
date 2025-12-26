import { BaseInit } from './BaseInit';
import { ConfigType } from './types';

export abstract class BaseWorker extends BaseInit {
  private _isRunning = false;
  private _isPaused = false;

  constructor(config: ConfigType) {
    super(config);
  }

  protected get isRunning(): boolean {
    return this._isRunning;
  }

  protected get isPaused(): boolean {
    return this._isPaused;
  }

  async start(): Promise<void> {
    if (this._isRunning) {
      await this.stop();
    }
    // Логика старта
    this._isRunning = true;
    this._isPaused = false;
  }

  async stop(): Promise<void> {
    // Логика остановки
    this._isRunning = false;
    this._isPaused = false;
  }

  async pause(): Promise<void> {
    if (this._isRunning && !this._isPaused) {
      // Логика паузы
      this._isPaused = true;
    }
  }
}