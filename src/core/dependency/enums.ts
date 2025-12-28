
//
// DEPENDENCY NAMES
// 
enum DependencyName {
    DEPENDENCY_INIT = "DEPENDENCY_INIT",
    DEPENDENCY_STATS = "DEPENDENCY_STATS", // Application statistics and analytics
    DEPENDENCY_DISPATCHER = "DEPENDENCY_DISPATCHER", // Release master stream on rxjs for dispatching events between services
    DEPENDENCY_STORAGE = "DEPENDENCY_STORAGE", // Local storage management
    DEPENDENCY_SERVICE_MACHINE = "DEPENDENCY_SERVICE_MACHINE", // Service providers: Is application started, is hidden, is visible, is online, etc.
    DEPENDENCY_SYSTEM_MACHINE = "DEPENDENCY_SYSTEM_MACHINE", // Release providers for system-level operations, like: OS data, mouse handlers, keyboard handlers, etc.
    DEPENDENCY_NETWORK = "DEPENDENCY_NETWORK", // Network, on Connection and WebSocket handlers
    DEPENDENCY_AUTH = "DEPENDENCY_AUTH", // Authentication and user session management
    DEPENDENCY_PLATFORM = "DEPENDENCY_PLATFORM", // Platform-specific services: web, mobile, desktop
    DEPENDENCY_LOADER = "DEPENDENCY_LOADER", // Loading resource, assets, files; Bundle loading, lazy loading, processing
    DEPENDENCY_RESOURCE = "DEPENDENCY_RESOURCE", // Resource management: distribute, store, optimize, parse (for multi-file resources, like: spine or 3d models)
    DEPENDENCY_SOUND = "DEPENDENCY_SOUND", // Sound management: play, pause, stop, volume, mute, etc.
    DEPENDENCY_LAYOUT = "DEPENDENCY_LAYOUT", // Layout management: screen size, orientation, responsive design
    DEPENDENCY_RENDERER = "DEPENDENCY_RENDERER", // Renderer management: WebGL, Canvas2D, SVG
};


//
// DISPATCHER ACTION NAMES
//

enum DispatcherActionName {
    DEFAUTL = "DEFAULT",
}

export { DependencyName, DispatcherActionName };