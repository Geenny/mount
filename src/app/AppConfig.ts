import * as configs from '../config';
import { ApplicationConfigType, DependencyMachineConfigType } from 'config/types';

export class AppConfig {

  configGet(): ApplicationConfigType {
    const config = configs.applicationConfig as ApplicationConfigType;
    config.configs = {
      dependencyMachineConfig: configs.dependencyMachineConfig as DependencyMachineConfigType,
    }
    return config;
  }

}