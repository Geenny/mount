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
    request: NetworkRequestType;
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
    endpoint?: string;
    heartbeatInterval?: number;
};

type NetworkConnectorCacheType = {
    storage?: NetworkCacheStorageEnum;
    ttl?: number;
};

type NetworkConnectorAuthType = {
    endpoint?: string;
    headerName?: string;
    headerPrefix?: string;
};

export type {
    NetworkRequestType,
    NetworkRequestParamsType,
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
