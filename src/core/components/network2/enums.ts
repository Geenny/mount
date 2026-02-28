//
// NETWORK
//

/**
 * Network request methods
 */
enum NetworkRequestMethodEnum {
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
enum NetworkConnectionTypeEnum {
    HTTP = 'HTTP',
    WEBSOCKET = 'WEBSOCKET'
}

/**
 * Network connection status
 */
enum NetworkConnectionStatusEnum {
    DISCONNECTED = 'DISCONNECTED',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    ERROR = 'ERROR',
    RECONNECTING = 'RECONNECTING'
}

/**
 * Network request status
 */
enum NetworkRequestStatusEnum {
    UNKNOWN = 'UNKNOWN',                     // Unknown status
    PENDING = 'PENDING',
    PROGRESS = 'PROGRESS',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    CANCELLED = 'CANCELLED',
    RETRY = 'RETRY'
}

enum NetworkDataTypeEnum {
    JSON = 'json',
    TEXT = 'text',
    BLOB = 'blob',
    ARRAYBUFFER = 'arraybuffer'
};

enum NetworkCacheStorageEnum {
    MEMORY = 'MEMORY',
    LOCAL_STORAGE = 'LOCAL_STORAGE',
    SESSION_STORAGE = 'SESSION_STORAGE'
};

//
// CONNECTOR
//

enum NetworkConnectorStatusEnum {
    DISCONNECTED = 'DISCONNECTED',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
};

export {
    NetworkRequestMethodEnum,
    NetworkConnectionTypeEnum,
    NetworkConnectionStatusEnum,
    NetworkRequestStatusEnum,
    NetworkDataTypeEnum,
    NetworkCacheStorageEnum,

    NetworkConnectorStatusEnum
};
