import { ComponentConfigType } from 'core/component/types';
import { systemDataConfig } from './system/config.system.component';
import { ComponentNameEnum, ComponentTypeEnum } from 'core/component/enums';
import {
    ApplicationComponent,
    StreamComponent,
    SystemComponent,
    CustomComponent
} from 'core/component';

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
            dependent: [ ComponentNameEnum.STREAM ],
        }
    }
};