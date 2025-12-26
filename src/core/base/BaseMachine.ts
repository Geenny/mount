import { BaseService } from './BaseService';

export interface IFSM {
  transitions: Map<string, Map<string, string>>;
  currentState: string;
  transition(action: string): void;
  log(level: string, message: string): void;
}

export abstract class BaseMachine extends BaseService implements IFSM {
  public transitions: Map<string, Map<string, string>> = new Map();
  public currentState: string = 'idle';

  transition(action: string): void {
    const stateTransitions = this.transitions.get(this.currentState);
    if (stateTransitions && stateTransitions.has(action)) {
      this.currentState = stateTransitions.get(action)!;
    }
  }

  log(level: string, message: string): void {
    console.log(`[${level}] [${this.name}] ${message}`);
  }
}