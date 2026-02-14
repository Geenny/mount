/**
 * Network request methods
 */
enum NetworkRequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS'
}

/**
 * Network connection types
 */
enum NetworkConnectionType {
    HTTP = 'HTTP',
    WEBSOCKET = 'WEBSOCKET'
}

/**
 * Network connection status
 */
enum NetworkConnectionStatus {
    DISCONNECTED = 'DISCONNECTED',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    ERROR = 'ERROR',
    RECONNECTING = 'RECONNECTING'
}

/**
 * Network request priority levels
 */
enum NetworkRequestPriority {
    LOW = 0,
    NORMAL = 5,
    HIGH = 10,
    CRITICAL = 20
}

/**
 * Network request status
 */
enum NetworkRequestStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    CANCELLED = 'CANCELLED',
    RETRY = 'RETRY'
}

/**
 * Storage types for cache
 */
enum NetworkCacheStorage {
    MEMORY = 'memory',
    LOCAL_STORAGE = 'localStorage',
    SESSION_STORAGE = 'sessionStorage'
}

export {
    NetworkRequestMethod,
    NetworkConnectionType,
    NetworkConnectionStatus,
    NetworkRequestPriority,
    NetworkRequestStatus,
    NetworkCacheStorage
};
