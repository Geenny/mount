import { BaseWorker } from 'core/base/BaseWorker';
import { output } from 'utils/output/Output';
import { DependencyMachine } from 'core/machine/dependency/implementations/DependencyMachine';
import { ApplicationConfigType, DependencyMachineConfigType } from 'config/types';

export class App extends BaseWorker {
  private dependencyMachine?: DependencyMachine;

  constructor(config: ApplicationConfigType) {
    super(config);
  }

  get isDebug(): boolean { return this.config.debug === true; }

  protected async onInit(): Promise<void> {
    output.log(this, 'App initializing with config:', this.config);

    const dependencyMachineConfig = this.config.configs?.dependencyMachineConfig as DependencyMachineConfigType
    this.dependencyMachine = new DependencyMachine(dependencyMachineConfig);
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