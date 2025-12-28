import { App } from 'app/App';
import { applicationConfigGet } from 'app/AppConfig';
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
    this.applicationConfig = applicationConfigGet();
    this.app = new App(this.applicationConfig);
    
    if (this.app.isDebug && typeof window !== 'undefined')
      window.app = this.app;
  }

  async start() {
    if (!this.app) return;

    await this.app.init();
    await this.app.start();
  }
}