import { ComponentConfigType } from 'core/components/types';
import { ComponentNetworkNameEnum, ComponentTypeEnum, ComponentNameEnum } from 'core/components/enums';
import { NetworkConnectorRequestComponent, NetworkConnectorSocketComponent } from 'core/components/network2/components';
import { 
    NetworkConnectionType,
    NetworkRequestMethod,
    NetworkCacheStorage 
} from "core/components/network/enums";
import { NetworkProtocolEnum } from 'core/components/network2/enums';

/**
 * Network connector components configuration
 * Each connector is a separate component with its own params
 */
export const networkComponentsConfig: Record< string, ComponentConfigType > = {
    [ ComponentNetworkNameEnum.CONNECTOR_REQUEST ]: {
        name: ComponentNetworkNameEnum.CONNECTOR_REQUEST,
        type: ComponentTypeEnum.SERVICE,
        dependent: [ ComponentNameEnum.STREAM ],
        unique: false,
        instance: NetworkConnectorRequestComponent,
        params: {

            id: 'http',                 // Server ID, it is must be unique
            isDefault: true,            // Default connector for requests without serverId

            server: {
                protocol: NetworkProtocolEnum.HTTP,
                host: 'localhost',
                port: 3001,
            },

            connection: {
                type: NetworkConnectionType.HTTP,
                method: NetworkRequestMethod.GET,

                // Retry settings
                retry: 3,               // Number of retry attempts, -1 = infinite
                retryDelay: 1000,
                timeout: 10000,
                
                concurrent: 5,          // Max concurrent requests, HTTP only
            },

            // Health check on init (blocks init until connected)
            health: {
                test: true,             // Test connection after onStart
                endpoint: '/health',
                heartbeatInterval: 0    // 0 - no heartbeat
            },
            
            // Cache settings, if exist it is enabled
            cache: {
                storage: NetworkCacheStorage.MEMORY,
                ttl: 60000 // 1 minute
            },
            
            // Auth settings
            auth: {
                endpoint: '/auth/refresh',
                headerName: 'Authorization',
                headerPrefix: 'Bearer'
            },
            
            // Default headers
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },
    
    [ ComponentNetworkNameEnum.CONNECTOR_SOCKET ]: {
        name: ComponentNetworkNameEnum.CONNECTOR_SOCKET,
        type: ComponentTypeEnum.SERVICE,
        dependent: [ ComponentNameEnum.STREAM ],
        unique: false,
        instance: NetworkConnectorSocketComponent,
        params: {

            id: 'socket',
            isDefault: false,

            server: {
                host: 'ws://localhost',
                port: 3002
            },

            connection: {
                type: NetworkConnectionType.WEBSOCKET,

                // Retry settings
                retry: 3,
                retryDelay: 1000,
                timeout: 5000,

                protocols: [ 'v1.notification.protocol' ],
            },

            health: {
                endpoint: undefined,
                heartbeatInterval: 30000 // 30 seconds
            },
            
            // WebSocket settings
            reconnectOnClose: true
        }
    }
};
