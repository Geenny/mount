import { ComponentName, ComponentTypeName } from 'core/component/enums';
import { ComponentConfigType,  } from 'core/component/types';
import {
    ApplicationComponent,
    StreamComponent
} from 'core/component';
import { SystemComponent } from 'core/component/system/SystemComponent';

export const componentsConfig: ComponentConfigType = {
    name: ComponentName.ENTRY,
    type: ComponentTypeName.COMPONENT,
    unique: true,
    components: {
        [ComponentName.APPLICATION]: {
            name: ComponentName.APPLICATION,
            type: ComponentTypeName.COMPONENT,
            unique: true,
            instance: ApplicationComponent,
            dependent: [ ComponentName.STREAM ],
            params: {
                debug: true,
                version: '0.1.0',
            }
        },
        [ComponentName.STREAM]: {
            name: ComponentName.STREAM,
            type: ComponentTypeName.SERVICE,
            unique: true,
            instance: StreamComponent,
        },
        [ComponentName.SYSTEM]: {
            name: ComponentName.SYSTEM,
            type: ComponentTypeName.SERVICE,
            dependent: [ ComponentName.STREAM ],
            unique: true,
            instance: SystemComponent,
        },
        [ComponentName.NETWORK]: {
            name: ComponentName.NETWORK,
            type: ComponentTypeName.COMPONENT,
            unique: true,
            dependent: [ ComponentName.STREAM ],
        }
    }
};