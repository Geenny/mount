import { 
    NetworkRequestMethodEnum,
    NetworkRequestStatusEnum,
    NetworkConnectionTypeEnum,
    NetworkCacheStorageEnum,
    NetworkDataTypeEnum
} from "./enums";

/**
 * Network request configuration
 */
type NetworkRequestType = {
    id?: number;

    endpoint?: string; // Where to send the request (e.g. /api/data, actions)

    data?: any; // Data for POST/PUT/PATCH

    handlers?: NetworkRequestHandlersType; // Optional callbacks for this request

    headers?: Record< string, string >; // Custom headers for this request

    params?: Record< string, any >; // Additional params

    options?: NetworkRequestOptionsType; // Additional options (cache, retry, priority, etc.)

    auth?: NetworkRequestAuthType; // Optional auth params
};

type NetworkRequestHandlersType = {

    onProgress?: ( request: NetworkRequestType ) => void; // Progress callback for uploads/downloads

    onStatus?: ( status: NetworkRequestStatusEnum ) => void; // Status change callback

    onSuccess?: ( request: NetworkRequestType ) => void; // Success callback

    onError?: ( request: NetworkRequestType, error?: Error ) => void; // Error callback

};

type NetworkRequestOptionsType = {

    // Optional server ID || generated automatically if omitted
    serverID?: string;

    // HTTP method (default GET)
    method?: NetworkRequestMethodEnum;

    // Headers
    headers?: Record< string, string >;

    // Data type
    dataType?: NetworkDataTypeEnum;
    
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
 * Network server auth configuration
 */
type NetworkServerAuthConfig = {
    token?: string;
    refreshToken?: string;
    refreshEndpoint?: string;
    headerName?: string; // default 'Authorization'
    headerPrefix?: string; // default 'Bearer'
};

type NetworkRequestStructType = {
    id: number;
    status: NetworkRequestStatusEnum;

    // Request Config
    url: string;
    request: NetworkRequestType;
    headers: Record< string, string >;
    method: NetworkRequestMethodEnum;

    progress: number; // 0 to 1

    connectorUnit: any; // actual connector instance (e.g. XMLHttpRequest, WebSocket or custom loader)

    priority: number;

    retry: number;
    retryDelay: number;

    data?: any;

    timeout?: NodeJS.Timeout;

    error?: Error;
}

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

/**
 * Network server configuration
 */
type NetworkConnectorType = {
    server: NetworkConnectorServerType;
    connection: NetworkConnectorConnectionType;
    health?: NetworkConnectorHealthType;
    cache?: NetworkConnectorCacheType;
    auth?: NetworkConnectorAuthType;
    headers?: Record< string, string >;
};

type NetworkConnectorServerType = {
    host: string;
    port?: number;
    protocol?: string; // http || https || ws || wss
    protocols?: string | string[]; // for WebSocket subprotocols
};

type NetworkConnectorConnectionType = {
    type: NetworkConnectionTypeEnum;
    method?: NetworkRequestMethodEnum;
    retry?: number;
    retryDelay?: number;
    timeout?: number;
    concurrent?: number;
};

type NetworkConnectorHealthType = {
    test?: boolean;
    heartbeatInterval?: number;
    request?: NetworkRequestType;
};

type NetworkConnectorCacheType = {
    storage?: NetworkCacheStorageEnum;
    ttl?: number;
};

type NetworkConnectorAuthType = {
    request?: string;
    headerName?: string;
    headerPrefix?: string;
};

export type {
    NetworkRequestType,
    NetworkRequestOptionsType,
    NetworkRequestAuthType,
    NetworkRequestStructType,
    NetworkServerAuthConfig,
    NetworkConnectionRequest,
    NetworkResponseType,
    NetworkErrorType,
    NetworkRequestStatsType,

    NetworkConnectorType,
    NetworkConnectorServerType,
    NetworkConnectorConnectionType,
    NetworkConnectorHealthType,
    NetworkConnectorCacheType,
    NetworkConnectorAuthType
};
