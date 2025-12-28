import { DependencyName } from 'core/dependency/enums';
import { DependencyMachineConfigType } from './types';
import { DependencyInit } from 'core/dependency/DependencyInit';
import { DependencyDispatcher } from 'core/dependency/DependencyDispatcher';
import { DependencyStats } from 'core/dependency/DependencyStats';
import { DependencyStorage } from 'core/dependency/DependencyStorage';

export const dependencyMachineConfig: DependencyMachineConfigType = {
    options: { },
    childrens: [
        {
            name: DependencyName.DEPENDENCY_STATS,
            dependentList: [DependencyName.DEPENDENCY_DISPATCHER],
            options: { },
            instance: DependencyStats
        },
        {
            name: DependencyName.DEPENDENCY_DISPATCHER,
            dependentList: [DependencyName.DEPENDENCY_INIT],
            options: { },
            instance: DependencyDispatcher
        },
        {
            name: DependencyName.DEPENDENCY_STORAGE,
            dependentList: [DependencyName.DEPENDENCY_DISPATCHER],
            options: { },
            instance: DependencyStorage
        },
        {
            name: DependencyName.DEPENDENCY_INIT,
            dependentList: [ ],
            options: { },
            instance: DependencyInit
        },
    ]
};
