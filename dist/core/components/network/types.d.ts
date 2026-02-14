import { NetworkRequestMethod, NetworkConnectionType, NetworkRequestStatus, NetworkCacheStorage } from "./enums";
/**
 * Network request configuration
 */
type NetworkRequestType = {
    serverId: string;
    endpoint: string;
    method?: NetworkRequestMethod;
    headers?: Record<string, string>;
    body?: any;
    cache?: boolean;
    retry?: number;
    timeout?: number;
    priority?: number;
    salt?: string;
    token?: string;
    refreshToken?: string;
    onProgress?: (progress: number) => void;
};
/**
 * Network server cache configuration
 */
type NetworkServerCacheConfig = {
    enabled: boolean;
    storage?: NetworkCacheStorage;
    ttl?: number;
};
/**
 * Network server auth configuration
 */
type NetworkServerAuthConfig = {
    token?: string;
    refreshToken?: string;
    refreshEndpoint?: string;
    headerName?: string;
    headerPrefix?: string;
};
/**
 * Network server configuration
 */
type NetworkServerConfig = {
    id: string;
    host: string;
    type: NetworkConnectionType;
    healthCheck?: NetworkRequestType;
    retry?: number;
    retryDelay?: number;
    timeout?: number;
    maxConcurrent?: number;
    cache?: NetworkServerCacheConfig;
    auth?: NetworkServerAuthConfig;
    headers?: Record<string, string>;
    protocols?: string[];
    reconnectOnClose?: boolean;
    heartbeatInterval?: number;
};
/**
 * Network connection request (queued request with metadata)
 */
type NetworkConnectionRequest = {
    id: string;
    config: NetworkRequestType;
    status: NetworkRequestStatus;
    priority: number;
    attempt: number;
    createdAt: number;
    startedAt?: number;
    completedAt?: number;
    error?: Error;
    abortController?: AbortController;
};
/**
 * Network response
 */
type NetworkResponseType<T = any> = {
    serverId: string;
    requestId: string;
    data: T;
    status: number;
    headers?: Record<string, string>;
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
export type { NetworkRequestType, NetworkServerConfig, NetworkServerCacheConfig, NetworkServerAuthConfig, NetworkConnectionRequest, NetworkResponseType, NetworkErrorType, NetworkStatsType };
