const NETWORK_EVENT = {
    // Request lifecycle
    REQUEST: 'network.request',
    REQUEST_QUEUED: 'network.request.queued',
    REQUEST_START: 'network.request.start',
    RESPONSE: 'network.response',
    ERROR: 'network.error',
    
    // Connection status
    CONNECTED: 'network.connected',
    DISCONNECTED: 'network.disconnected',
    RECONNECTING: 'network.reconnecting',
    
    // Interceptors
    BEFORE_REQUEST: 'network.before.request',
    AFTER_RESPONSE: 'network.after.response'
};

export { NETWORK_EVENT };
