import { ComponentConfigType } from 'core/components/types';
import { ComponentNetworkNameEnum, ComponentTypeEnum, ComponentNameEnum } from 'core/components/enums';
import { NetworkConnectorRequestComponent, NetworkConnectorSocketComponent } from 'core/components/network/components';
import { 
    NetworkConnectionTypeEnum,
    NetworkRequestMethodEnum,
    NetworkCacheStorageEnum
} from "core/components/network/enums";
import { NetworkProtocolEnum } from 'core/components/network/enums';

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
                type: NetworkConnectionTypeEnum.HTTP,
                method: NetworkRequestMethodEnum.GET,

                // Retry settings
                retry: 3,               // Number of retry attempts, -1 = infinite
                retryDelay: 1000,
                timeout: 10000,
                
                concurrent: 5,          // Max concurrent requests, HTTP only
            },

            // Health check on init (blocks init until connected)
            health: {
                test: false,                // Test connection after onStart
                heartbeatInterval: 60000,   // less 1000 - no heartbeat
                request: {
                    endpoint: '/health',
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            },
            
            // Cache settings, if exist it is enabled
            cache: {
                storage: NetworkCacheStorageEnum.MEMORY,
                ttl: 60000 // 1 minute
            },
            
            // Auth settings
            auth: {
                request: {
                    endpoint: '/auth/refresh',
                },
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
                protocol: NetworkProtocolEnum.WS,
                host: 'localhost',
                port: 3002,
                protocols: [ 'v1.notification.protocol' ] // for WebSocket subprotocols
            },

            connection: {
                type: NetworkConnectionTypeEnum.WEBSOCKET,

                // Retry settings
                retry: 3,
                retryDelay: 1000,
                timeout: 5000,

                protocols: [ 'v1.notification.protocol' ],
            },

            health: {
                heartbeatInterval: 30000,   // 30 seconds
                request: {
                    data: {
                        type: 'PING'
                    }
                }
            },
            
            // WebSocket settings
            reconnectOnClose: true
        }
    }
};
