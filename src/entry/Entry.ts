import { App } from 'app/App';
import { AppConfig } from 'app/AppConfig';
import { ApplicationConfigType } from 'config/types';

declare global {
  interface Window {
    app?: App;
  }
}

export class Entry {
  private app?: App;
  private applicationConfig?: ApplicationConfigType;

  constructor() {
    this.applicationConfig = this.configGet();
    this.app = new App(this.applicationConfig);
    
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
   * @returns @ApplicationConfigType
   */
  configGet(): ApplicationConfigType {
    const appConfig = new AppConfig();
    return appConfig.configGet();
  }
}