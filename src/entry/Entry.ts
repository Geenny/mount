import { App } from 'app/App';
import { AppConfigType } from 'config/types';
import { appConfig } from 'config/config.app';

declare global {
  interface Window {
    app?: App;
  }
}

export class Entry {
  private app?: App;

  constructor() {
    this.app = new App(this.configGet());
    
    if (this.app.isDebug && typeof window !== 'undefined')
      window.app = this.app;
  }

  async start() {
    if (!this.app) return;

    await this.app.init();
    await this.app.start();
  }

  /**
   * For overriden in subclasses to provide custom config
   * @returns @AppConfigType
   */
  configGet(): AppConfigType {
    return appConfig;
  }
}