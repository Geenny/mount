import { BaseWorker } from '../core/base/BaseWorker';
import { appConfig } from '../config/config.app';
import { output } from '../utils/output/Output';

export class App extends BaseWorker {
  constructor() {
    super(appConfig);
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
}