import { App } from 'app/App';
import { AppConfig } from 'app/AppConfig';
import { AppConfigType } from 'config/types';

declare global {
  interface Window {
    app?: App;
  }
}

export class Entry {
  private app?: App;
  private appConfig?: AppConfigType;

  constructor() {
    this.appConfig = this.configGet();
    this.app = new App(this.appConfig);
    
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
    const appConfig = new AppConfig();
    return appConfig.configGet();
  }
}