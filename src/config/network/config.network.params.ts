import { 
    NetworkServerConfig 
} from "core/components/network/types";
import { 
    NetworkConnectionType,
    NetworkRequestMethod,
    NetworkCacheStorage 
} from "core/components/network/enums";

/**
 * Network component params configuration
 * Define all servers and connection settings here
 */
export const networkParams = {
    servers: [
        // Example HTTP server with health check
        {
            id: 'api-main',
            host: 'https://api.example.com',
            type: NetworkConnectionType.HTTP,
            
            // Health check on init
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
        },
        
        // Example WebSocket server
        {
            id: 'ws-notifications',
            host: 'wss://ws.example.com',
            type: NetworkConnectionType.WEBSOCKET,
            
            // Retry settings (infinite retries for WebSocket)
            retry: -1,
            retryDelay: 2000,
            timeout: 30000,
            
            // WebSocket settings
            protocols: [ 'v1.notification.protocol' ],
            reconnectOnClose: true,
            heartbeatInterval: 30000 // 30 seconds
        },
        
        // Example local development server
        {
            id: 'api-dev',
            host: 'http://localhost:3000',
            type: NetworkConnectionType.HTTP,
            
            retry: 1,
            retryDelay: 500,
            timeout: 10000,
            maxConcurrent: 10,
            
            cache: {
                enabled: false
            }
        }
    ] as NetworkServerConfig[]
};
