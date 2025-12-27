import { BaseWorker } from 'core/base/BaseWorker';
import { ConfigType } from 'core/base/types';
import { output } from 'utils/output/Output';

export class App extends BaseWorker {
  constructor(config: ConfigType) {
    super(config);
  }

  async init(): Promise<void> {
    // Initialization
    output.log(this, 'App initializing with config:', this.config);
    await super.init();
  }

  async destroy(): Promise<void> {
    // Cleanup
    await super.destroy();
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