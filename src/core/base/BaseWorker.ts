import { BaseInit } from './BaseInit';
import { output } from '../../utils/output/Output';

export abstract class BaseWorker extends BaseInit {
  protected _isRunning = false;
  protected _isPaused = false;

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
    if (!this.isInit) {
      output.warn(this, 'Cannot start: not initialized');
      return;
    }

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

  async pause( paused: boolean | undefined = undefined ): Promise<void> {
    if ( !this._isRunning ) return;
    
    let change = false;

    if ( paused === undefined ) {
      this._isPaused = !this._isPaused;
      change = true;
    } else if ( paused !== this._isPaused ) {
      this._isPaused = paused;
      change = true;
    }
    
    if ( !change ) return;
    
    if (this._isPaused) {
      await this.onPause();
    } else {
      await this.onUnpause();
    }
  }

  async destroy(): Promise<void> {
    if (this.isWorking) {
      await this.stop();
    }
    await super.destroy();
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
  protected async onUnpause(): Promise<void> {
    // Логика при снятии с паузы
  }
}