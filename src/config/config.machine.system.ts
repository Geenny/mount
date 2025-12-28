import { SystemName } from 'core/system/enums';
import { SystemMachineConfigType } from './types';
import { SystemData, SystemKeyboard, SystemMouse } from 'core/system';

export const systemMachineConfig: SystemMachineConfigType = {
    options: { },
    childrens: [
        {
            name: SystemName.DATA,
            instance: SystemData,
            options: { }
        },
        {
            name: SystemName.MOUSE,
            instance: SystemMouse,
            options: { }
        },
        {
            name: SystemName.KEYBOARD,
            instance: SystemKeyboard,
            options: { }
        },
    ]
};
