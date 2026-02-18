# Mount Engine - Technical Architecture

## Overview

Mount is a modular TypeScript engine implementing a component-based architecture with strict MVC pattern and event-driven communication.

## Core Principles

### 1. Component Architecture
- **Base Pattern:** All components extend from base classes with lifecycle management
- **MVC Separation:** Model (data via Proxy) → Controller (logic) → View (presentation)
- **Dependency Rule:** Model/View only know Controller, never each other

### 2. Event-Driven Communication
- **StreamComponent:** Central event bus for inter-component communication
- **Publisher/Subscriber:** Components communicate via events, not direct calls
- **Event Types:** Defined in `core/constants` (SYSTEM_EVENT, NETWORK_EVENT, etc.)

### 3. Configuration Pattern
- **Hierarchical Config:** Components can contain child components
- **Type-Safe:** All configs implement `ComponentConfigType`
- **Centralized:** Main config in `config/config.component.ts`

## Component Structure

### Base Components

```
BaseComponent
├── BaseController (extends BaseWorker)
│   ├── onStart() - initialization logic
│   ├── onStop() - cleanup logic
│   └── emit() - publish events
├── BaseModel (extends BaseData)
│   └── data - Proxy-based reactive data
└── BaseView
    └── controllerSet() - controller linkage
```

### Component Lifecycle

1. **Construction:** `new Component()`
2. **Configuration:** `configure(config)`
3. **Initialization:** `init()` → `onInit()`
4. **Start:** `start()` → `onStart()`
5. **Work:** Event handling, business logic
6. **Stop:** `stop()` → `onStop()`
7. **Destroy:** `destroy()` → `onDestroy()`

## NetworkComponent Architecture

### Structure

```
NetworkComponent (main component)
├── Model (data management)
│   ├── requestQueues: Map<string, NetworkConnectionRequest[]>
│   ├── activeRequests: Map<string, NetworkConnectionRequest>
│   ├── caches: Map<string, Storage>
│   └── stats: NetworkStatsType
├── View (empty - no UI)
└── Controller (orchestration)
    ├── onRequest() - handle incoming requests
    ├── onResponse() - handle responses
    ├── onError() - handle errors
    ├── checkCache() - cache lookup
    ├── addToQueue() - queue management
    ├── processQueue() - queue processing
    ├── shouldRetry() - retry logic
    └── saveToCache() - cache storage

Child Components (Connectors):
├── NetworkConnectorRequestComponent (HTTP/HTTPS)
│   ├── Model (connection state)
│   ├── View (empty)
│   └── Controller (fetch API logic)
└── NetworkConnectorSocketComponent (WebSocket)
    ├── Model (connection state, messages)
    ├── View (empty)
    └── Controller (WebSocket logic)
```

### Data Flow

```
Application
    ↓ emit(NETWORK_EVENT.REQUEST)
StreamComponent
    ↓ subscribe
NetworkComponent.Controller
    ↓ checkCache / addToQueue / processQueue
    ↓ emit(NETWORK_EVENT.REQUEST_START)
NetworkConnectorRequestComponent.Controller
    ↓ HTTP fetch / WebSocket send
    ↓ emit(NETWORK_EVENT.RESPONSE / ERROR)
NetworkComponent.Controller
    ↓ saveToCache / updateStats
    ↓ emit(NETWORK_EVENT.RESPONSE / ERROR)
Application
```

### Configuration

Location: `config/network/config.network.components.ts`

```typescript
networkComponentsConfig = {
    CONNECTOR_REQUEST: {
        instance: NetworkConnectorRequestComponent,
        params: {
            id: 'api-main',
            host: 'http://localhost:3001',
            type: NetworkConnectionType.HTTP,
            retry: 3,
            timeout: 5000,
            cache: { enabled: true, ttl: 60000 },
            // ...
        }
    },
    CONNECTOR_SOCKET: {
        instance: NetworkConnectorSocketComponent,
        params: {
            id: 'ws-notifications',
            host: 'ws://localhost:3002',
            type: NetworkConnectionType.WEBSOCKET,
            // ...
        }
    }
}
```

### Key Design Decisions

#### 1. Connectors as Components (Not Helper Classes)
**Rationale:** Consistent architecture, easier testing, independent lifecycle

**Before:**
```typescript
// Helper class approach (rejected)
class NetworkConnector {
    constructor(config) { /* ... */ }
    send(request) { /* ... */ }
}
```

**After:**
```typescript
// Full MVC component
class NetworkConnectorRequestComponent extends StreamSubscribeComponent {
    protected classes = { Controller, Model, View };
}
```

#### 2. Config via Components (Not Params)
**Rationale:** Matches SystemComponent pattern, scalable

**Before:**
```typescript
params: {
    servers: [/* array of server configs */]
}
```

**After:**
```typescript
components: {
    CONNECTOR_REQUEST: { /* full component config */ },
    CONNECTOR_SOCKET: { /* full component config */ }
}
```

#### 3. Main Controller as Orchestrator (Not Direct Executor)
**Rationale:** Separation of concerns, queue management, caching centralized

- NetworkComponent.Controller: queue, cache, routing
- Connector.Controller: actual HTTP/WS communication

## SystemComponent Architecture

Similar pattern to NetworkComponent but for system-level features:

```
SystemComponent
├── Components:
│   ├── SystemVisibilityComponent (page visibility)
│   ├── SystemResizeComponent (window resize)
│   └── SystemKeyboardComponent (keyboard events)
└── Configuration: config/system/config.system.component.ts
```

## Project Structure

```
mount/
├── src/
│   ├── core/
│   │   ├── base/                    # Base classes
│   │   │   ├── BaseComponent.ts
│   │   │   ├── BaseController.ts
│   │   │   ├── BaseModel.ts
│   │   │   └── BaseView.ts
│   │   ├── components/              # Main components
│   │   │   ├── network/
│   │   │   │   ├── NetworkComponent.ts
│   │   │   │   ├── mvc/             # Network MVC
│   │   │   │   │   ├── Controller.ts
│   │   │   │   │   ├── Model.ts
│   │   │   │   │   └── View.ts
│   │   │   │   ├── components/      # Child components
│   │   │   │   │   ├── request/     # HTTP connector
│   │   │   │   │   │   ├── NetworkConnectorRequestComponent.ts
│   │   │   │   │   │   └── mvc/
│   │   │   │   │   └── socket/      # WebSocket connector
│   │   │   │   │       ├── NetworkConnectorSocketComponent.ts
│   │   │   │   │       └── mvc/
│   │   │   │   ├── types.ts
│   │   │   │   ├── enums.ts
│   │   │   │   └── interface.ts
│   │   │   ├── system/
│   │   │   ├── stream/
│   │   │   ├── application/
│   │   │   └── custom/
│   │   └── constants/               # Event constants
│   ├── config/                      # Configuration
│   │   ├── config.component.ts      # Main config
│   │   ├── network/
│   │   │   └── config.network.components.ts
│   │   └── system/
│   │       └── config.system.component.ts
│   ├── utils/                       # Utilities
│   │   ├── output/                  # Logging
│   │   └── storage/                 # Storage wrapper
│   └── __tests__/                   # Tests
│       ├── network.test.ts
│       ├── system.*.test.ts
│       └── ...
├── webpack/                         # Build config
├── package.json
├── tsconfig.json
└── README.md

mount_server/                        # Separate test servers
├── http/
│   └── server.js                    # Express API (port 3001)
├── websocket/
│   └── server.js                    # WebSocket server (port 3002)
├── check-status.js
├── stop-servers.sh
└── package.json
```

## Testing Strategy

### Unit Tests
- Component initialization
- MVC structure validation
- Data model verification
- Method decomposition

### Integration Tests
- Event flow between components
- Configuration loading
- Lifecycle management

### Network Tests (with mount_server)
- HTTP requests (GET, POST, PUT, DELETE)
- WebSocket connections
- Cache behavior
- Retry logic
- Error handling

**Test Commands:**
```bash
npm test                    # All tests
npm test -- network.test.ts # Specific test
```

## Development Workflow

### 1. Component Development
```typescript
// 1. Define interfaces
interface IMyComponent extends IComponent { /* ... */ }
interface IMyController extends IController { /* ... */ }
interface IMyModel extends IModel { /* ... */ }
interface IMyView extends IView { /* ... */ }

// 2. Create Model (data only)
class Model extends BaseModel implements IMyModel {
    get myData() { return this.data.myData; }
    set myData(value) { this.data.myData = value; }
}

// 3. Create View (if needed)
class View extends BaseView implements IMyView {
    // Usually empty unless rendering
}

// 4. Create Controller (business logic)
class Controller extends BaseController implements IMyController {
    async onStart() {
        // Subscribe to events
        this.component.subscribe(EVENT_NAME, this.handler.bind(this));
    }
}

// 5. Create Component (composition)
class MyComponent extends StreamSubscribeComponent implements IMyComponent {
    protected classes = { Controller, Model, View };
}

// 6. Add to configuration
// config/my/config.my.components.ts
export const myComponentsConfig = { /* ... */ };

// 7. Register in main config
// config/config.component.ts
```

### 2. Adding Network Connector

To add a new network connector type:

1. Create connector directory: `core/components/network/components/my-connector/`
2. Implement MVC structure
3. Add to `ComponentNetworkNameEnum` enum
4. Add configuration in `config.network.components.ts`
5. Update exports in `components/index.ts`

### 3. Event Communication

```typescript
// Publishing
this.emit(EVENT_NAME, data);

// Subscribing
this.component.subscribe(EVENT_NAME, (data) => {
    // Handle event
});

// Unsubscribing
this.component.unsubscribe(EVENT_NAME, handlerFunction);
```

## Code Style

### Naming Conventions
- **Components:** PascalCase + "Component" suffix
- **Files:** PascalCase for classes, lowercase for utils
- **Events:** UPPER_SNAKE_CASE
- **Enums:** PascalCase

### File Organization
- One class per file
- Interface in `interface.ts` of component folder
- Types in `types.ts`
- Enums in `enums.ts`
- MVC in `mvc/` subfolder

### TypeScript
- Strict mode enabled
- No `any` except where absolutely necessary (e.g., component access patterns)
- All public APIs typed
- Use interfaces for contracts

## Performance Considerations

### Event System
- Unsubscribe unused listeners
- Use event pooling for high-frequency events

### Network Component
- Cache enabled by default (configurable)
- Request queue with priority
- Concurrent request limits
- Retry with exponential backoff

### Memory Management
- Components properly destroyed
- Maps/Sets cleared on cleanup
- Event listeners removed

## Future Improvements

### Potential Enhancements
1. **Network Component:**
   - Request batching
   - Response streaming
   - GraphQL connector
   - Offline queue persistence

2. **Testing:**
   - Integration tests with mount_server
   - Performance benchmarks
   - E2E tests

3. **Architecture:**
   - Hot module replacement
   - Component lazy loading
   - Plugin system

4. **Developer Experience:**
   - CLI for component generation
   - Debug panel
   - Performance profiler

## References

- **Base Classes:** `src/core/base/`
- **Component Pattern:** `src/core/components/system/` (good reference)
- **Configuration:** `src/config/config.component.ts`
- **Events:** `src/core/constants/`
- **Tests:** `src/__tests__/`

## Changelog

### 2026-02-17
- **NetworkComponent:** Complete refactor to match SystemComponent architecture
  - Converted connectors from helper classes to full MVC components
  - Updated config from `params` to `components` structure
  - Decomposed Controller methods for better maintainability
  - Fixed MVC dependencies (removed `any` cross-dependencies)
- **mount_server:** Created separate test server project
  - HTTP API server (port 3001) with Express
  - WebSocket server (port 3002) with `ws` library
  - Management scripts (start/stop/status)
- **Tests:** Refactored network tests for new architecture
  - 3 initialization tests passing
  - Integration tests ready for mount_server

---

**Last Updated:** 2026-02-17  
**Version:** 0.0.92  
**Maintainer:** a-firsov
