import { BaseWorker } from '../core/base/BaseWorker';
import { appConfig } from '../config/config.app';
import { output } from '../utils/output/Output';

export class App extends BaseWorker {
  constructor() {
    super(appConfig);
  }

  init(): this {
    // Initialization
    output.log(this, 'App initializing with config:', this.config);
    return super.init();
  }

  destroy(): void {
    // Cleanup
    super.destroy();
  }

  async start(): Promise<void> {
    output.log(this, 'Engine app started');
    await super.start();
  }

  async stop(): Promise<void> {
    output.log(this, 'Engine app stopped');
    await super.stop();
  }

  async pause(): Promise<void> {
    output.log(this, 'Engine app paused');
    await super.pause();
  }
}