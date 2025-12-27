import { App } from 'app/App';
import { appConfig as config } from 'config/config.app';

declare global {
  interface Window {
    app?: App;
  }
}

export class Entry {
  private app: App;

  constructor() {
    this.app = new App(config);

    if (config.debug && typeof window !== 'undefined')
      window.app = this.app;
  }

  async start() {
    await this.app.init();
    await this.app.start();
  }
}