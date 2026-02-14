declare enum ComponentTypeEnum {
    COMPONENT = "COMPONENT",
    SERVICE = "SERVICE"
}
declare enum ComponentNameEnum {
    NONE = "NONE",
    ENTRY = "ENTRY",
    STREAM = "STREAM",// Provide exchange data between components
    SYSTEM = "SYSTEM",// Provide system changes like, resize, visibility, keyboard, etc
    APPLICATION = "APPLICATION",// Provide application changes like, route, state, etc
    NETWORK = "NETWORK",// Network
    LOADER = "LOADER",// Loader of application resources
    RESOURCES = "RESOURCES",// Parse, save and struct resources of application
    DISPLAY = "DISPLAY",// Provide display for components (access to DOM, canvas, some div's, etc)
    LAYOUT = "LAYOUT",// Get posibility to create and manage layouts
    RENDERER = "RENDERER"
}
declare enum ComponentSystemNameEnum {
    VISIBILITY = "VISIBILITY",
    RESIZE = "RESIZE",
    KEYBOARD = "KEYBOARD",
    MOUSE = "MOUSE"
}
export { ComponentTypeEnum, ComponentNameEnum, ComponentSystemNameEnum };
