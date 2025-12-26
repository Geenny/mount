import { BaseMachine } from '../../base/BaseMachine';
import { DependencyConfig } from './DependencyConfig';

export { DependencyConfig };

export class DependencyMachine extends BaseMachine {
  private dependencies: Map<string, any> = new Map();

  constructor(private dependencyConfigs: DependencyConfig[]) {
    super({ ID: 'dependency-machine', name: 'DependencyMachine' });
    this.setupTransitions();
  }

  private setupTransitions(): void {
    this.transitions.set('idle', new Map([['start', 'loading']]));
    this.transitions.set('loading', new Map([['resolve', 'loaded'], ['error', 'error']]));
    this.transitions.set('loaded', new Map());
    this.transitions.set('error', new Map());
  }

  async initialize(): Promise<void> {
    this.transition('start');
    this.log('info', 'Starting dependency resolution');

    try {
      const depMap = new Map<string, DependencyConfig>();
      this.dependencyConfigs.forEach(dep => depMap.set(dep.name, dep));

      // Simple topological sort for dependencies
      const resolved = new Set<string>();
      const resolving = new Set<string>();

      const resolve = async (name: string): Promise<any> => {
        if (resolved.has(name)) return this.dependencies.get(name);
        if (resolving.has(name)) throw new Error(`Circular dependency: ${name}`);

        resolving.add(name);
        const dep = depMap.get(name);
        if (!dep) throw new Error(`Dependency not found: ${name}`);

        // Resolve dependencies first
        if (dep.dependencies) {
          for (const depName of dep.dependencies) {
            await resolve(depName);
          }
        }

        // Initialize this dependency
        const instance = await dep.factory();
        this.dependencies.set(name, instance);
        resolved.add(name);
        resolving.delete(name);
        return instance;
      };

      // Initialize all
      for (const dep of this.dependencyConfigs) {
        await resolve(dep.name);
      }

      this.transition('resolve');
      this.log('info', 'All dependencies resolved');
    } catch (error) {
      this.transition('error');
      this.log('error', `Dependency resolution failed: ${error}`);
      throw error;
    }
  }

  get<T>(name: string): T {
    return this.dependencies.get(name);
  }

  async destroy(): Promise<void> {
    // Destroy dependencies if needed
  }
}