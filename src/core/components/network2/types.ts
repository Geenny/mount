import { 
    NetworkRequestMethodEnum,
    NetworkRequestStatusEnum,
    NetworkConnectionTypeEnum,
    NetworkConnectionStatusEnum,
    NetworkDataTypeEnum
} from "./enums";

/**
 * Network request configuration
 */
type NetworkRequestType = {

    endpoint?: string; // Where to send the request (e.g. /api/data, actions)

    data?: any; // Data for POST/PUT/PATCH

    handlers?: NetworkRequestHandlersType; // Optional callbacks for this request

    headers?: Record< string, string >; // Custom headers for this request

    params?: NetworkRequestParamsType; // Additional params (cache, retry, priority, etc.)

    auth?: NetworkRequestAuthType; // Optional auth params
};

type NetworkRequestHandlersType = {

    onProgress?: ( progress: number ) => void; // Progress callback for uploads/downloads

    onStatus?: ( status: NetworkRequestStatusEnum ) => void; // Status change callback

};

type NetworkRequestParamsType = {

    // Optional server ID || generated automatically if omitted
    serverID?: string;

    // HTTP method (default GET)
    method?: NetworkRequestMethodEnum;

    // Headers
    headers?: Record< string, string >;

    // Data type
    dataType?: NetworkDataTypeEnum;
    
    // Cache settings
    // cache?: boolean;
    
    // Retry settings
    // retry?: number; // 0 & -1 = infinite retries
    // timeout?: number;
    
    // Priority
    priority?: number; // default 0, higher = earlier
    
    // Salt for cache busting
    // salt?: string; // adds /?req_ver=salt to URL

};

type NetworkRequestAuthType = {
    token?: string;
    refreshToken?: string;
}

/**
 * Network server cache configuration
 */
type NetworkServerCacheConfig = {
    enabled: boolean;
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
    type: NetworkConnectionTypeEnum;
    
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
    status: NetworkRequestStatusEnum;
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
type NetworkRequestStatsType = {
    total: number;
    success: number;
    errors: number;
    active: number;
    queued: number;
};

export type {
    NetworkRequestType,
    NetworkRequestParamsType,
    NetworkRequestAuthType,

    NetworkServerConfig,
    NetworkServerCacheConfig,
    NetworkServerAuthConfig,
    NetworkConnectionRequest,
    NetworkResponseType,
    NetworkErrorType,
    NetworkRequestStatsType
};
