import { AppConfigType, DependencyMachineConfigType, ServiceMachineConfigType, StateMachineConfigType } from './types';
import * as configs from './';

export const appConfig: AppConfigType = {
  name: 'Mount App',
  version: '1',
  debug: true,
  configs: {
    dependencyMachineConfig: configs.dependencyMachineConfig as DependencyMachineConfigType,
    stateMachineConfig: configs.stateMachineConfig as StateMachineConfigType,
    serviceMachineConfig: configs.serviceMachineConfig as ServiceMachineConfigType,
    systemMachineConfig: configs.systemMachineConfig as ServiceMachineConfigType,
  }
  // Добавьте другие настройки по необходимости
};