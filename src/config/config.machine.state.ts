import { StateName } from 'core/machine/state/enums';
import { StateMachineConfigType } from './types';

export const stateMachineConfig: StateMachineConfigType = {
    options: { initialState: StateName.INTRO }, // Добавлено начальное состояние
    childrens: [
        { state: StateName.INTRO, from: [], to: [StateName.INIT] },
        { state: StateName.INIT, from: [StateName.INTRO], to: [StateName.LOADING] },
        { state: StateName.LOADING, from: [StateName.INIT], to: [StateName.READY] },
        { state: StateName.READY, from: [StateName.LOADING], to: [] }
    ]
};
