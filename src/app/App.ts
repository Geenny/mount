import { BaseWorker } from 'core/base/BaseWorker';
import { ConfigType } from 'core/base/types';
import { output } from 'utils/output/Output';
import { DependencyMachine } from 'core/machine/dependency/implementations/DependencyMachine';

export class App extends BaseWorker {
  private dependencyMachine?: DependencyMachine;

  constructor(config: ConfigType) {
    super(config);
  }

  protected async onInit(): Promise<void> {
    output.log(this, 'App initializing with config:', this.config);
    this.dependencyMachine = new DependencyMachine();
    await this.dependencyMachine.init();
  }

  protected async onDestroy(): Promise<void> {
    if (this.dependencyMachine) {
      await this.dependencyMachine.destroy();
    }
  }

  protected async onStart(): Promise<void> {
    output.log(this, 'Engine app started');
    if (this.dependencyMachine) {
      await this.dependencyMachine.start();
    }
  }

  protected async onStop(): Promise<void> {
    output.log(this, 'Engine app stopped');
    if (this.dependencyMachine) {
      await this.dependencyMachine.stop();
    }
  }

  protected async onPause(): Promise<void> {
    output.log(this, 'Engine app paused');
    if (this.dependencyMachine) {
      await this.dependencyMachine.pause();
    }
  }

  protected async onUnpause(): Promise<void> {
    output.log(this, 'Engine app unpaused');
    if (this.dependencyMachine) {
      await this.dependencyMachine.pause(); // Since pause toggles
    }
  }
}