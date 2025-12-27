import { DependencyName } from 'core/dependency/enums';
import { DependencyMachineConfigType } from './types';

export const dependencyConfig: DependencyMachineConfigType = {
    options: { },
    childrens: [
        {
            name: DependencyName.DEPENDENCY_INIT,
            dependentList: [ ],
            options: { }
        },
        {
            name: DependencyName.DEPENDENCY_DISPATCHER,
            dependentList: [DependencyName.DEPENDENCY_INIT],
            options: { }
        },
        {
            name: DependencyName.DEPENDENCY_STATS,
            dependentList: [DependencyName.DEPENDENCY_DISPATCHER],
            options: { }
        },
        {
            name: DependencyName.DEPENDENCY_STORAGE,
            dependentList: [DependencyName.DEPENDENCY_DISPATCHER],
            options: { }
        }
    ]
};
