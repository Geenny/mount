import * as configs from '../config';
import { ApplicationConfigType, DependencyMachineConfigType } from 'config/types';

const applicationConfigGet = (): ApplicationConfigType => {
    const applicationConfig = configs.applicationConfig as ApplicationConfigType;
    applicationConfig.configs = {
      dependencyMachineConfig: configs.dependencyMachineConfig as DependencyMachineConfigType,
    }
    return applicationConfig;
}

export { applicationConfigGet };