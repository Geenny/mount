import { DependencyName } from 'core/dependency/enums';
import { ConfigType } from '../core/base/types';
import { DependencyMachineConfigType } from './types';

export const appConfig: DependencyMachineConfigType = {
    childrens: [
        {
            name: DependencyName.DEPENDENCY_INIT,
            options: { }
        },
        {
            name: DependencyName.DEPENDENCY_STATS,
            dependentList: [DependencyName.DEPENDENCY_INIT],
            options: { }
        },
        {
            name: DependencyName.DEPENDENCY_DISPATCHER,
            dependentList: [DependencyName.DEPENDENCY_INIT],
            options: { }
        },
        {
            name: DependencyName.DEPENDENCY_STORAGE,
            dependentList: [DependencyName.DEPENDENCY_INIT],
            options: { }
        }
    ]
};