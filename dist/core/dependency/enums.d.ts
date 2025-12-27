export declare enum DependencyName {
    DEPENDENCY_INIT = 0,
    DEPENDENCY_DISPATCHER = 1,// Release master stream for dispatching events between services
    DEPENDENCY_STORAGE = 2,// Local storage management
    DEPENDENCY_SERVICE_MACHINE = 3,// 
    DEPENDENCY_SYSTEM_MACHINE = 4,// Release providers for system-level operations, like: OS data, mouse handlers, keyboard handlers, etc.
    DEPENDENCY_NETWORK = 5,// Network, on Connection and WebSocket handlers
    DEPENDENCY_AUTH = 6,// Authentication and user session management
    DEPENDENCY_PLATFORM = 7,// 
    DEPENDENCY_LOADER = 8,// Loading resource, assets, files
    DEPENDENCY_RESOURCE = 9,// Resource management: distribute, store, optimize, parse (for multi-file resources, like: spine or 3d models)
    DEPENDENCY_LAYOUT = 10,// Layout management: screen size, orientation, responsive design
    DEPENDENCY_RENDERER = 11
}
