import { BaseInit } from '../../base/BaseInit';
import { Subject } from 'rxjs';
import { StateMachineConfigType } from '../../../config/types';
import { StateName } from './enums';

export interface IState {
  name: StateName;
  onEnter?(): void;
  onExit?(): void;
}

export class StateMachine extends BaseInit {
  private states = new Map<StateName, IState>();
  private currentState: IState | null = null;
  private transitions = new Map<StateName, Map<string, StateName>>();
  public stateChanged$ = new Subject<{ from: StateName; to: StateName }>();

  constructor(private config: StateMachineConfigType) {
    super();
  }

  async init(): Promise<void> {
    await super.init();
    this.buildFromConfig();
    this.setInitialState(StateName.INTRO); // Или из конфига
  }

  private buildFromConfig(): void {
    for (const child of this.config.childrens) {
      // Создаём состояния (пока простые объекты)
      const state: IState = { name: child.state as StateName };
      this.addState(state);

      // Переходы
      for (const to of child.to) {
        this.setTransition(child.state as StateName, 'auto', to as StateName); // Событие 'auto' для примера
      }
    }
  }

  addState(state: IState): void {
    this.states.set(state.name, state);
  }

  setTransition(from: StateName, event: string, to: StateName): void {
    if (!this.transitions.has(from)) {
      this.transitions.set(from, new Map());
    }
    this.transitions.get(from)!.set(event, to);
  }

  transition(event: string): boolean {
    if (!this.currentState) return false;
    const trans = this.transitions.get(this.currentState.name)?.get(event);
    if (!trans || !this.states.has(trans)) return false;

    this.currentState.onExit?.();
    const newState = this.states.get(trans)!;
    this.currentState = newState;
    newState.onEnter?.();
    this.stateChanged$.next({ from: this.currentState.name, to: trans });
    return true;
  }

  setInitialState(name: StateName): void {
    this.currentState = this.states.get(name) || null;
  }

  getCurrentState(): IState | null {
    return this.currentState;
  }

  async destroy(): Promise<void> {
    this.stateChanged$.complete();
    await super.destroy();
  }
}