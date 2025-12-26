import { DependencyMachine, DependencyConfig } from '../core/machines/dependency/DependencyMachine';
import { output } from '../utils/output/Output';
import { BaseWorker } from '../core/base/BaseWorker';

export class App extends BaseWorker {
  private dependencyMachine: DependencyMachine;

  constructor(config: DependencyConfig[]) {
    super({ ID: 'app', name: 'App' });
    this.dependencyMachine = new DependencyMachine(config);
  }

  async init(): Promise<void> {
    await super.init();
    await this.dependencyMachine.initialize();
  }

  async destroy(): Promise<void> {
    await this.dependencyMachine.destroy();
  }

  async start(): Promise<void> {
    this.isRunning = true;
    output.log(this, 'Engine app started');
  }

  getDependency<T>(name: string): T {
    return this.dependencyMachine.get<T>(name);
  }
}