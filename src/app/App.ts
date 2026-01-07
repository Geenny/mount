import { BaseWorker } from 'core/base/BaseWorker';
import { output } from 'utils/output/Output';
// import { DependencyMachine } from 'core/machine/dependency/DependencyMachine';
// import { AppConfigType, DependencyMachineConfigType } from 'config/types';

export class App extends BaseWorker {
  // private dependencyMachine?: DependencyMachine;


  //
  // GETTERS
  //

  get isDebug(): boolean { return this.config?.debug === true; }


  //
  // LIFECYCLE METHODS
  //

  protected async onInit(): Promise<void> {
    output.log(this, 'Initializing:', this.config);

    // await this.dependencyInit();
  }

  protected async onDestroy(): Promise<void> {
    // if (this.dependencyMachine) {
    //   await this.dependencyMachine.destroy();
    // }
  }

  protected async onStart(): Promise<void> {
    // if (this.dependencyMachine) {
    //   await this.dependencyMachine.start();
    // }
    output.log(this, 'App: Started!!!');
  }

  protected async onStop(): Promise<void> {
    output.log(this, 'App: Stopped!!!');
    // if (this.dependencyMachine) {
    //   await this.dependencyMachine.stop();
    // }
  }

  protected async onPause(): Promise<void> {
    output.log(this, 'App: Paused!!!');
    // if (this.dependencyMachine) {
    //   await this.dependencyMachine.pause();
    // }
  }

  protected async onUnpause(): Promise<void> {
    output.log(this, 'App: Unpaused!!!');
    // if (this.dependencyMachine) {
    //   await this.dependencyMachine.pause(); // Since pause toggles
    // }
  }


  //
  // DEPENDENCY MACHINE
  //

  // protected async dependencyInit(): Promise<void> {
  //   const dependencyMachineConfig = this.config.configs?.dependencyMachineConfig as DependencyMachineConfigType;

  //   if (!dependencyMachineConfig) {
  //     output.warn(this, 'No dependency machine config found!!!');
  //     return;
  //   }

  //   this.dependencyMachine = new DependencyMachine(dependencyMachineConfig);
  //   await this.dependencyMachine.init();
  // }
}