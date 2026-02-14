import { ComponentConfigType } from 'core/component/types';
import { ComponentSystemNameEnum, ComponentTypeEnum } from 'core/component/enums';
import { CustomComponent } from 'core/component/custom/CustomComponent';

export const systemDataConfig: Record<string, ComponentConfigType> = {
    [ComponentSystemNameEnum.VISIBILITY]: {
        name: ComponentSystemNameEnum.VISIBILITY,
        type: ComponentTypeEnum.SERVICE,
        unique: true,
        instance: CustomComponent
    },
    [ComponentSystemNameEnum.RESIZE]: {
        name: ComponentSystemNameEnum.RESIZE,
        type: ComponentTypeEnum.SERVICE,
        unique: true,
        instance: CustomComponent
    },
    [ComponentSystemNameEnum.KEYBOARD]: {
        name: ComponentSystemNameEnum.KEYBOARD,
        type: ComponentTypeEnum.SERVICE,
        unique: true,
        instance: CustomComponent
    },
};