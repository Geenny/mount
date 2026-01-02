import { BaseWorker } from 'core/base/BaseWorker';
import { output } from 'utils/output/Output';
import { DependencyMachine } from 'core/machine/dependency/DependencyMachine';
import { AppConfigType, DependencyMachineConfigType } from 'config/types';
import { Graph } from 'core/base/construstion/data/graph/Graph';

export class App extends BaseWorker {
  private dependencyMachine?: DependencyMachine;

  constructor(config: AppConfigType) {
    super(config);
  }


  //
  // GETTERS
  //

  get isDebug(): boolean { return this.config.debug === true; }


  //
  // LIFECYCLE METHODS
  //

  protected async onInit(): Promise<void> {
    output.log(this, 'Initializing:', this.config);



    const map = new Map<string, string[]>();
    map.set('A', ['B', 'C']);
    map.set('B', ['A', 'D', 'E']);
    map.set('C', ['A', 'D']);
    map.set('D', ['B', 'C', 'E']);
    map.set('E', ['B']);

    const graph = new Graph<string>(map);
    console.log('Graph created:', graph);

    console.log(graph.isBinded( 'A', 'B' )); // true
    console.log(graph.isBinded( 'A', 'E' )); // false
    console.log(graph.isBinded( 'E', 'C' )); // false
    console.log(graph.isBinded( 'E', 'D' )); // true

    console.log(graph.isComplete); // true






    await this.dependencyInit();
  }

  protected async onDestroy(): Promise<void> {
    if (this.dependencyMachine) {
      await this.dependencyMachine.destroy();
    }
  }

  protected async onStart(): Promise<void> {
    if (this.dependencyMachine) {
      await this.dependencyMachine.start();
    }
    output.log(this, 'App: Started!!!');
  }

  protected async onStop(): Promise<void> {
    output.log(this, 'App: Stopped!!!');
    if (this.dependencyMachine) {
      await this.dependencyMachine.stop();
    }
  }

  protected async onPause(): Promise<void> {
    output.log(this, 'App: Paused!!!');
    if (this.dependencyMachine) {
      await this.dependencyMachine.pause();
    }
  }

  protected async onUnpause(): Promise<void> {
    output.log(this, 'App: Unpaused!!!');
    if (this.dependencyMachine) {
      await this.dependencyMachine.pause(); // Since pause toggles
    }
  }


  //
  // DEPENDENCY MACHINE
  //

  protected async dependencyInit(): Promise<void> {
    const dependencyMachineConfig = this.config.configs?.dependencyMachineConfig as DependencyMachineConfigType;

    if (!dependencyMachineConfig) {
      output.warn(this, 'No dependency machine config found!!!');
      return;
    }

    this.dependencyMachine = new DependencyMachine(dependencyMachineConfig);
    await this.dependencyMachine.init();
  }
}