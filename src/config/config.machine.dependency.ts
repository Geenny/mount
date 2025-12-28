import { DependencyName } from 'core/dependency/enums';
import { DependencyMachineConfigType } from './types';
import { DependencyInit } from 'core/dependency/implementations/DependencyInit';
import { DependencyDispatcher } from 'core/dependency/implementations/DependencyDispatcher';
import { DependencyStats } from 'core/dependency/implementations/DependencyStats';
import { DependencyStorage } from 'core/dependency/implementations/DependencyStorage';

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
