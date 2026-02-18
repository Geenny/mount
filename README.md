# Engine

Modular TypeScript engine for simulations.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Testing

### Run all tests

```bash
npm test
```

### Run specific test

```bash
npm test -- network.test.ts
```

### Network Component Tests

Current tests focus on:
- Component initialization
- MVC structure verification
- Data model validation

**Note:** Full integration tests with HTTP/WebSocket connections will require `mount_server`:

```bash
# Terminal 1: Start test servers
cd ../mount_server
npm start

# Terminal 2: Run tests
cd ../mount
npm test
```

Test servers:
- HTTP Server: `http://localhost:3001`
- WebSocket Server: `ws://localhost:3002`