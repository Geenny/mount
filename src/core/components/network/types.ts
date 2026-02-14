import { 
    NetworkRequestMethod, 
    NetworkConnectionType, 
    NetworkRequestStatus,
    NetworkCacheStorage,
    NetworkConnectionStatus
} from "./enums";

/**
 * Network request configuration
 */
type NetworkRequestType = {
    serverId: string;
    endpoint: string;
    method?: NetworkRequestMethod;
    headers?: Record< string, string >;
    body?: any;
    
    // Cache settings
    cache?: boolean;
    
    // Retry settings
    retry?: number; // -1 = infinite retries
    timeout?: number;
    
    // Priority
    priority?: number; // default 0, higher = earlier
    
    // Salt for cache busting
    salt?: string; // adds /?req_ver=salt to URL
    
    // Auth (optional)
    token?: string;
    refreshToken?: string;
    
    // Callbacks
    onProgress?: ( progress: number ) => void;
};

/**
 * Network server cache configuration
 */
type NetworkServerCacheConfig = {
    enabled: boolean;
    storage?: NetworkCacheStorage;
    ttl?: number; // time to live in ms
};

/**
 * Network server auth configuration
 */
type NetworkServerAuthConfig = {
    token?: string;
    refreshToken?: string;
    refreshEndpoint?: string;
    headerName?: string; // default 'Authorization'
    headerPrefix?: string; // default 'Bearer'
};

/**
 * Network server configuration
 */
type NetworkServerConfig = {
    id: string;
    host: string;
    type: NetworkConnectionType;
    
    // Health check on init (blocks init if set)
    healthCheck?: NetworkRequestType;
    
    // Retry settings
    retry?: number; // -1 = infinite
    retryDelay?: number; // ms between retries
    timeout?: number;
    
    // Concurrent request limits (HTTP only)
    maxConcurrent?: number; // default 1
    
    // Cache (optional)
    cache?: NetworkServerCacheConfig;
    
    // Auth (optional)
    auth?: NetworkServerAuthConfig;
    
    // Headers
    headers?: Record< string, string >;
    
    // WebSocket settings
    protocols?: string[];
    reconnectOnClose?: boolean;
    heartbeatInterval?: number; // for ping/pong in ms
};

/**
 * Network connection request (queued request with metadata)
 */
type NetworkConnectionRequest = {
    id: string; // unique request ID
    config: NetworkRequestType;
    status: NetworkRequestStatus;
    priority: number;
    attempt: number; // current retry attempt
    createdAt: number;
    startedAt?: number;
    completedAt?: number;
    error?: Error;
    abortController?: AbortController;
};

/**
 * Network response
 */
type NetworkResponseType< T = any > = {
    serverId: string;
    requestId: string;
    data: T;
    status: number;
    headers?: Record< string, string >;
    error?: Error;
    timestamp: number;
};

/**
 * Network error response
 */
type NetworkErrorType = {
    serverId: string;
    requestId: string;
    request: NetworkConnectionRequest;
    error: Error;
    timestamp: number;
};

/**
 * Network statistics
 */
type NetworkStatsType = {
    totalRequests: number;
    successRequests: number;
    errorRequests: number;
    activeRequests: number;
    queuedRequests: number;
};

export type {
    NetworkRequestType,
    NetworkServerConfig,
    NetworkServerCacheConfig,
    NetworkServerAuthConfig,
    NetworkConnectionRequest,
    NetworkResponseType,
    NetworkErrorType,
    NetworkStatsType
};
