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
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
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

export {
    NetworkRequestMethodEnum,
    NetworkConnectionTypeEnum,
    NetworkConnectionStatusEnum,
    NetworkRequestStatusEnum,
    NetworkDataTypeEnum
};
