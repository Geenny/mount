import { ComponentConfigType } from 'core/components/types';
import { systemDataConfig } from './system/config.system.component';
import { networkParams } from './network/config.network.params';
import { ComponentNameEnum, ComponentTypeEnum } from 'core/components/enums';
import {
    ApplicationComponent,
    StreamComponent,
    SystemComponent,
    NetworkComponent,
    CustomComponent
} from 'core/components';

export const componentsConfig: ComponentConfigType = {
    name: ComponentNameEnum.ENTRY,
    type: ComponentTypeEnum.COMPONENT,
    instance: CustomComponent,
    unique: true,
    components: {
        [ComponentNameEnum.APPLICATION]: {
            name: ComponentNameEnum.APPLICATION,
            type: ComponentTypeEnum.COMPONENT,
            unique: true,
            instance: ApplicationComponent,
            dependent: [ ComponentNameEnum.STREAM ],
            params: {
                debug: true,
                version: '0.1.0',
            }
        },
        [ComponentNameEnum.STREAM]: {
            name: ComponentNameEnum.STREAM,
            type: ComponentTypeEnum.SERVICE,
            unique: true,
            instance: StreamComponent,
        },
        [ComponentNameEnum.SYSTEM]: {
            name: ComponentNameEnum.SYSTEM,
            type: ComponentTypeEnum.SERVICE,
            dependent: [ ComponentNameEnum.STREAM ],
            unique: true,
            instance: SystemComponent,
            components: systemDataConfig
        },
        [ComponentNameEnum.NETWORK]: {
            name: ComponentNameEnum.NETWORK,
            type: ComponentTypeEnum.SERVICE,
            unique: true,
            instance: NetworkComponent,
            dependent: [ ComponentNameEnum.STREAM, ComponentNameEnum.SYSTEM ],
            params: networkParams
        }
    }
};