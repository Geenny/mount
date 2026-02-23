# Mount Engine - Technical Architecture

## Overview

Mount is a modular TypeScript engine implementing a component-based architecture with strict MVC pattern and event-driven communication.

## Core Principles

### 1. Component Architecture
- **Base Pattern:** All components extend from base classes with lifecycle management
- **MVC Separation:** Model (data via Proxy) → Controller (logic) → View (presentation)
- **Dependency Rule:** Model/View only know Controller, never each other

### 2. Messaging and Communication
- **BaseRecipient:** Core messaging infrastructure with private subscriber management
- **StreamComponent:** Central event bus for inter-component communication
- **Publisher/Subscriber:** Components communicate via events, not direct calls
- **Event Types:** Defined in `core/constants` (SYSTEM_EVENT, NETWORK_EVENT, etc.)
- **Recipient Pattern:** Parents/dependencies register via `recipientSet()`, accessed via `recipientGet()`
- **Children Management:** Automatic subscription to SYSTEM messages for add/remove tracking

### 3. Configuration Pattern
- **Hierarchical Config:** Components can contain child components
- **Type-Safe:** All configs implement `ComponentConfigType`
- **Centralized:** Main config in `config/config.component.ts`

## Component Structure

### Base Architecture

```
BaseRecipient (extends BaseWorker)
│   Core messaging infrastructure
├── #subscriberMap: Map<string, BaseRecipient> - private subscribers
├── recipientSet(name, recipient) - register recipient
├── recipientGet(name) - get recipient by name
├── message(type, action, data) - broadcast to all subscribers
└── onMessage(type, action, data) - handle incoming messages

BaseComponent (extends BaseRecipient)
│   Component with MVC and children management
├── childrenMap: Map<number, BaseComponent> - child components
├── onMessage() - filters SYSTEM messages, handles children add/remove
├── childrenHandle() - process START/STOP actions
├── childrenAdd() - add child to map
├── childrenRemove() - remove child from map
│
├── BaseController (extends BaseWorker)
│   ├── onStart() - initialization logic
│   ├── onStop() - cleanup logic
│   └── emit() - publish events
├── BaseModel (extends BaseData)
│   └── data - Proxy-based reactive data
└── BaseView (optional)
    └── controllerSet() - controller linkage
```

### Component Lifecycle

1. **Construction:** `new Component()`
2. **Configuration:** `configure(config)`
3. **Initialization:** `init()` → `onInit()`
   - Creates Model, View, Controller
   - Sets up MVC linkage
   - Broadcasts `SYSTEM/START` message to recipients
4. **Start:** `start()` → `onStart()`
   - Starts View and Controller
5. **Work:** Event handling, business logic, children management
6. **Stop:** `stop()` → `onStop()`
   - Stops View and Controller
7. **Destroy:** `destroy()` → `onDestroy()`
   - Broadcasts `SYSTEM/STOP` message to recipients
   - Cleans up Controller, View
   - Clears subscriber map

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

#### 4. BaseRecipient Pattern (Evolved from BaseSubscription)
**Rationale:** Better encapsulation, automatic children management, simplified parent access

**Key Improvements:**
- **Private `#subscriberMap`** - Cannot be accidentally modified externally
- **`recipientGet()`** - Clean API for accessing parents/dependencies
- **Automatic Children Tracking** - Via SYSTEM messages, no manual management
- **Scalability** - Handles large numbers of children efficiently

**Before (BaseSubscription):**
```typescript
// Manual subscriber management, exposed internal state
class BaseSubscription {
    protected subscriberMap = new Map(); // Public
    // Manual tracking required
}
```

**After (BaseRecipient):**
```typescript
// Encapsulated, automatic management
class BaseRecipient {
    #subscriberMap = new Map(); // Private
    recipientSet(name, recipient) { /* ... */ }
    recipientGet(name) { /* ... */ }
    // Automatic via onMessage() in BaseComponent
}
```

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

## Recipient Pattern and Children Management

### BaseRecipient Architecture

**Purpose:** Core messaging infrastructure with private subscriber management for scalable parent-child communication.

**Key Features:**
- `#subscriberMap` - Private Map of registered recipients (encapsulation)
- `recipientSet(name, recipient)` - Register a recipient (usually parent or dependency)
- `recipientGet(name)` - Retrieve recipient by name for communication
- `message(type, action, data)` - Broadcast message to all registered recipients
- `onMessage(type, action, data)` - Handle incoming messages (override in subclasses)

### Children Management in BaseComponent

**Automatic Subscription Flow:**

1. **Component Initialization** → Broadcasts `SYSTEM/START` message
2. **Parent's onMessage()** → Receives message, filters for SYSTEM type
3. **childrenHandle()** → Processes START action
4. **childrenAdd()** → Adds component to `childrenMap`

**Removal Flow:**

1. **Component Destroy** → Broadcasts `SYSTEM/STOP` message
2. **Parent's onMessage()** → Receives message
3. **childrenHandle()** → Processes STOP action
4. **childrenRemove()** → Removes component from `childrenMap`

### Recipient Setup via Components Manager

Location: `src/core/components/Components.ts`

```typescript
protected componentRecipientSet( componentStruct: ComponentStructType ): void {
    const { component, config } = componentStruct;
    const list = this.componentDependentFromCurrentGet( config );
    
    if ( !list || list.length === 0 ) return;
    
    // Register dependencies as recipients
    list.forEach( ( recipient ) => component.recipientSet( recipient.name, recipient ) );
}
```

**Benefits:**
1. **Encapsulation** - `subscriberMap` is private, cannot be accidentally modified
2. **Automatic Management** - Children automatically register/unregister via SYSTEM messages
3. **Scalability** - Works seamlessly with large numbers of children
4. **Type Safety** - Access parents/dependencies through typed `recipientGet()`
5. **Clean Separation** - No direct references between siblings

**Example Usage:**

```typescript
// In a component that needs to access its parent
class MyComponent extends BaseComponent {
    
    protected doSomething(): void {
        // Get parent StreamComponent
        const stream = this.recipientGet( 'STREAM' );
        
        if ( stream ) {
            // Use parent
            stream.emit( MY_EVENT.SOMETHING, data );
        }
    }
    
    onMessage( type: RecipientTypeEnum, action: RecipientActionEnum, data: any ): void {
        super.onMessage( type, action, data );
        
        // Handle custom messages
        if ( type === RecipientTypeEnum.DATA ) {
            // Process data from children or dependencies
        }
    }
}
```

## Project Structure

```
mount/
├── src/
│   ├── core/
│   │   ├── base/                    # Base classes
│   │   │   ├── construction/
│   │   │   │   ├── recipient/       # Messaging infrastructure
│   │   │   │   │   ├── BaseRecipient.ts
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── enum.ts
│   │   │   │   ├── component/       # Component base
│   │   │   │   │   ├── BaseComponent.ts
│   │   │   │   │   ├── BaseController.ts
│   │   │   │   │   ├── BaseModel.ts
│   │   │   │   │   ├── BaseView.ts
│   │   │   │   │   ├── interface.ts
│   │   │   │   │   └── types.ts
│   │   │   │   └── subscription/    # (Legacy - being phased out)
│   │   │   ├── BaseWorker.ts
│   │   │   └── BaseData.ts
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
│   │   │   ├── subscribe/           # StreamSubscribeComponent
│   │   │   └── custom/
│   │   ├── Components.ts            # Component manager
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

### Recipient Pattern
- Private `#subscriberMap` prevents accidental modifications
- Automatic children management reduces manual tracking overhead
- Efficient Map-based lookups via `recipientGet()`
- SYSTEM messages filtered early in `onMessage()` 

### Event System
- Unsubscribe unused listeners
- Use event pooling for high-frequency events
- Children automatically unsubscribe on destroy

### Network Component
- Cache enabled by default (configurable)
- Request queue with priority
- Concurrent request limits
- Retry with exponential backoff

### Memory Management
- Components properly destroyed
- Maps/Sets cleared on cleanup (including `childrenMap`)
- Event listeners removed
- Recipient subscribers cleared in `onDestroy()`

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

- **Base Classes:** `src/core/base/construction/`
  - **BaseRecipient:** `src/core/base/construction/recipient/BaseRecipient.ts` - Core messaging
  - **BaseComponent:** `src/core/base/construction/component/BaseComponent.ts` - Component base with MVC
  - **BaseController/Model/View:** `src/core/base/construction/component/`
- **Component Pattern:** `src/core/components/system/` (good reference)
- **Network Component:** `src/core/components/network/` (advanced example with children)
- **Components Manager:** `src/core/components/Components.ts` - Initialization and dependency management
- **Configuration:** `src/config/config.component.ts`
- **Events:** `src/core/constants/`
- **Tests:** `src/__tests__/`

## Changelog

### 2026-02-23
- **BaseRecipient Pattern:** Evolved from BaseSubscription for better encapsulation
  - Renamed `BaseSubscription` → `BaseRecipient` for clearer semantics
  - Made `subscriberMap` private (`#subscriberMap`) for encapsulation
  - Added `recipientGet(name)` for clean parent/dependency access
  - Automatic children management via SYSTEM messages in BaseComponent
- **BaseComponent:** Enhanced children tracking
  - Added `childrenMap: Map<number, BaseComponent>` for child management
  - Implemented `onMessage()` to handle SYSTEM START/STOP for automatic add/remove
  - Methods: `childrenHandle()`, `childrenAdd()`, `childrenRemove()`
  - Simplifies working with large numbers of child components
- **Components Manager:** Updated recipient setup
  - `componentRecipientSet()` now registers dependencies via `recipientSet()`
  - Automatic parent-child relationship establishment during initialization
- **Benefits:** 
  - Better encapsulation (private fields)
  - Automatic children subscription/unsubscription
  - Cleaner API for accessing parents via `recipientGet()`
  - Scales better with many children

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

**Last Updated:** 2026-02-23  
**Version:** 0.0.92  
**Maintainer:** a-firsov
