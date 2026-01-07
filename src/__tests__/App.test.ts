// import { App } from '../app/App';
// import { appConfig } from 'config/config.app';

/**
 * Test suite for App lifecycle management.
 * Tests cover initialization, starting, pausing, stopping, restarting, and destroying the App instance.
 * Ensures proper state transitions and dependency management.
 */
// describe('App Lifecycle', () => {
//   let app: App;

//   /**
//    * Setup: Create a new App instance before each test.
//    */
//   beforeEach(() => {
//     // app = new App(appConfig);
//   });

//   /**
//    * Teardown: Destroy the App instance after each test if initialized.
//    */
//   afterEach(async () => {
//     if (app.isInit) {
//       await app.destroy();
//     }
//   });

//   /**
//    * Test: App should initialize correctly.
//    * Verifies that after calling init(), the App is marked as initialized.
//    */
//   test('should initialize correctly', async () => {
//     await app.init();
//     expect(app.isInit).toBe(true);
//   });

//   /**
//    * Test: App should start after initialization.
//    * Ensures that starting the App after init sets it to working state.
//    */
//   test('should start after init', async () => {
//     await app.init();
//     await app.start();
//     expect(app.isWorking).toBe(true);
//   });

//   /**
//    * Test: App should pause when working.
//    * Verifies that pausing a working App sets paused state and stops working.
//    */
//   test('should pause when working', async () => {
//     await app.init();
//     await app.start();
//     await app.pause();
//     expect(app.isPaused).toBe(true);
//     expect(app.isWorking).toBe(false);
//   });

//   /**
//    * Test: App should unpause when paused.
//    * Tests the toggle behavior: pause when paused should unpause and resume working.
//    */
//   test('should unpause when paused', async () => {
//     await app.init();
//     await app.start();
//     await app.pause(); // First pause
//     expect(app.isPaused).toBe(true);
//     await app.pause(); // Second pause (unpause)
//     expect(app.isPaused).toBe(false);
//     expect(app.isWorking).toBe(true);
//   });

//   /**
//    * Test: App should stop when working.
//    * Ensures stopping a working App transitions to non-working and non-running state.
//    */
//   test('should stop when working', async () => {
//     await app.init();
//     await app.start();
//     await app.stop();
//     expect(app.isWorking).toBe(false);
//     expect(app.isRunning).toBe(false);
//   });

//   /**
//    * Test: App should restart after stop.
//    * Verifies that App can be started again after being stopped.
//    */
//   test('should restart after stop', async () => {
//     await app.init();
//     await app.start();
//     await app.stop();
//     await app.start(); // Restart
//     expect(app.isWorking).toBe(true);
//   });

//   /**
//    * Test: App should destroy after stop.
//    * Tests that destroying the App after stop resets initialization state.
//    */
//   test('should destroy after stop', async () => {
//     await app.init();
//     await app.start();
//     await app.stop();
//     await app.destroy();
//     expect(app.isInit).toBe(false);
//   });

//   /**
//    * Test: App should handle multiple pause/unpause cycles.
//    * Ensures consistent toggle behavior across multiple pause calls.
//    */
//   test('should handle multiple pause/unpause', async () => {
//     await app.init();
//     await app.start();
//     await app.pause(); // Pause
//     expect(app.isPaused).toBe(true);
//     await app.pause(); // Unpause
//     expect(app.isPaused).toBe(false);
//     await app.pause(); // Pause again
//     expect(app.isPaused).toBe(true);
//   });
// });