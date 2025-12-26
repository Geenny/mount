import { BaseIdentify } from './BaseIdentify';

export abstract class BaseWorker extends BaseIdentify {
  protected isRunning: boolean = false;

  constructor(props: { ID: string; name: string }) {
    super(props);
  }

  async init(): Promise<void> {
    // Initialization logic
  }

  async destroy(): Promise<void> {
    this.isRunning = false;
  }

  async start(): Promise<void> {
    this.isRunning = true;
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }
}