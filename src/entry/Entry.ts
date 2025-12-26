import { App } from '../app/App';

export class Entry {
  private app: App;

  constructor() {
    this.app = new App();
  }

  async start() {
    await this.app.init();
    await this.app.start();
  }
}