import * as configs from '../config';
import { AppConfigType, DependencyMachineConfigType, ServiceMachineConfigType, StateMachineConfigType } from 'config/types';

export class AppConfig {

  configGet(): AppConfigType {
    const config = configs.appConfig as AppConfigType;
    config.configs = {
      dependencyMachineConfig: configs.dependencyMachineConfig as DependencyMachineConfigType,
      stateMachineConfig: configs.stateMachineConfig as StateMachineConfigType,
      serviceMachineConfig: configs.serviceMachineConfig as ServiceMachineConfigType,
      systemMachineConfig: configs.systemMachineConfig as ServiceMachineConfigType,
    }
    return config;
  }

}