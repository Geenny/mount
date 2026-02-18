import { ComponentConfigType } from 'core/components/types';
import { ComponentNetworkNameEnum, ComponentTypeEnum, ComponentNameEnum } from 'core/components/enums';
import { NetworkConnectorRequestComponent, NetworkConnectorSocketComponent } from 'core/components/network/components';
import { 
    NetworkConnectionType,
    NetworkRequestMethod,
    NetworkCacheStorage 
} from "core/components/network/enums";

/**
 * Network connector components configuration
 * Each connector is a separate component with its own params
 */
export const networkComponentsConfig: Record< string, ComponentConfigType > = {
    [ ComponentNetworkNameEnum.CONNECTOR_REQUEST ]: {
        name: ComponentNetworkNameEnum.CONNECTOR_REQUEST,
        type: ComponentTypeEnum.SERVICE,
        dependent: [ ComponentNameEnum.STREAM ],
        unique: true,
        instance: NetworkConnectorRequestComponent,
        params: {
            id: 'api-main',
            host: 'http://localhost:3001',
            type: NetworkConnectionType.HTTP,
            
            // Health check on init (blocks init until connected)
            healthCheck: {
                serverId: 'api-main',
                endpoint: '/health',
                method: NetworkRequestMethod.GET
            },
            
            // Retry settings
            retry: 3,
            retryDelay: 1000,
            timeout: 5000,
            
            // Max concurrent requests
            maxConcurrent: 5,
            
            // Cache settings
            cache: {
                enabled: true,
                storage: NetworkCacheStorage.MEMORY,
                ttl: 60000 // 1 minute
            },
            
            // Auth settings
            auth: {
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
        unique: true,
        instance: NetworkConnectorSocketComponent,
        params: {
            id: 'ws-notifications',
            host: 'ws://localhost:3002',
            type: NetworkConnectionType.WEBSOCKET,
            
            // Retry settings (infinite retries for WebSocket)
            retry: -1,
            retryDelay: 2000,
            timeout: 30000,
            
            // WebSocket settings
            protocols: [ 'v1.notification.protocol' ],
            reconnectOnClose: true,
            heartbeatInterval: 30000 // 30 seconds
        }
    }
};
