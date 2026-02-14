import { ComponentConfigType } from 'core/components/types';
import { ComponentNameEnum, ComponentSystemNameEnum, ComponentTypeEnum } from 'core/components/enums';
import { SystemVisibilityComponent, SystemResizeComponent, SystemKeyboardComponent } from 'core/components/system/components';

export const systemDataConfig: Record<string, ComponentConfigType> = {
    [ComponentSystemNameEnum.VISIBILITY]: {
        name: ComponentSystemNameEnum.VISIBILITY,
        type: ComponentTypeEnum.SERVICE,
        dependent: [ ComponentNameEnum.STREAM ],
        unique: true,
        instance: SystemVisibilityComponent
    },
    [ComponentSystemNameEnum.RESIZE]: {
        name: ComponentSystemNameEnum.RESIZE,
        type: ComponentTypeEnum.SERVICE,
        dependent: [ ComponentNameEnum.STREAM ],
        unique: true,
        instance: SystemResizeComponent
    },
    [ComponentSystemNameEnum.KEYBOARD]: {
        name: ComponentSystemNameEnum.KEYBOARD,
        type: ComponentTypeEnum.SERVICE,
        dependent: [ ComponentNameEnum.STREAM ],
        unique: true,
        instance: SystemKeyboardComponent
    },
};