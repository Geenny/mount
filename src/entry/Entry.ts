import { App } from '../app/App';
import { config } from '../config/config';

export class Entry {
  private app: App;

  constructor() {
    this.app = new App(config);
  }

  async start() {
    await this.app.init();
    await this.app.start();
  }
}