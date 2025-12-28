import { ServiceName } from 'core/machine/service/enums';
import { ServiceMachineConfigType } from './types';
// import { ServiceLogger, ServiceNetwork } from 'core/service'; // Добавьте классы, когда реализуете

export const serviceMachineConfig: ServiceMachineConfigType = {
    options: { },
    childrens: [
        // {
        //     name: ServiceName.LOGGER,
        //     instance: ServiceLogger,
        //     options: { level: 'info' }
        // },
        // Добавьте другие сервисы
    ]
};