import { Entry } from '../entry/Entry';
import { componentsConfig } from 'config/config.component';

/**
 * Test suite for Entry lifecycle management.
 * Tests cover initialization, starting, pausing, stopping, restarting, and destroying the Entry instance.
 * Ensures proper state transitions and dependency management.
 */
describe('Entry Lifecycle', () => {
  let entry: Entry;

  /**
   * Setup: Create a new Entry instance before each test.
   */
  beforeEach(() => {
    entry = new Entry();
  });

  /**
   * Teardown: Destroy the Entry instance after each test if initialized.
   */
  afterEach(async () => {
    if (entry['components']?.isInit) {
      await entry['components'].destroy();
    }
  });

  /**
   * Test: Entry should initialize correctly.
   * Verifies that after calling init(), the Components are marked as initialized.
   */
  test('should initialize correctly', async () => {
    const components = entry['components'];
    if (!components) throw new Error('Components not created');
    
    await components.init(componentsConfig);
    expect(components.isInit).toBe(true);
  });

  /**
   * Test: Entry should start after initialization.
   * Ensures that starting the Entry after init sets it to working state.
   */
  test('should start after init', async () => {
    const components = entry['components'];
    if (!components) throw new Error('Components not created');
    
    await components.init(componentsConfig);
    await components.start();
    expect(components.isWorking).toBe(true);
  });

  /**
   * Test: Entry should pause when working.
   * Verifies that pausing a working Entry sets paused state and stops working.
   */
  test('should pause when working', async () => {
    const components = entry['components'];
    if (!components) throw new Error('Components not created');
    
    await components.init(componentsConfig);
    await components.start();
    await components.pause();
    expect(components.isPaused).toBe(true);
    expect(components.isWorking).toBe(false);
  });

  /**
   * Test: Entry should unpause when paused.
   * Tests the toggle behavior: pause when paused should unpause and resume working.
   */
  test('should unpause when paused', async () => {
    const components = entry['components'];
    if (!components) throw new Error('Components not created');
    
    await components.init(componentsConfig);
    await components.start();
    await components.pause(); // First pause
    expect(components.isPaused).toBe(true);
    await components.pause(); // Second pause (unpause)
    expect(components.isPaused).toBe(false);
    expect(components.isWorking).toBe(true);
  });

  /**
   * Test: Entry should stop when working.
   * Ensures stopping a working Entry transitions to non-working and non-running state.
   */
  test('should stop when working', async () => {
    const components = entry['components'];
    if (!components) throw new Error('Components not created');
    
    await components.init(componentsConfig);
    await components.start();
    await components.stop();
    expect(components.isWorking).toBe(false);
    expect(components.isRunning).toBe(false);
  });

  /**
   * Test: Entry should restart after stop.
   * Verifies that Components can be started again after being stopped.
   */
  test('should restart after stop', async () => {
    const components = entry['components'];
    if (!components) throw new Error('Components not created');
    
    await components.init(componentsConfig);
    await components.start();
    await components.stop();
    await components.start(); // Restart
    expect(components.isWorking).toBe(true);
  });

  /**
   * Test: Entry should destroy after stop.
   * Tests that destroying the Components after stop resets initialization state.
   */
  test('should destroy after stop', async () => {
    const components = entry['components'];
    if (!components) throw new Error('Components not created');
    
    await components.init(componentsConfig);
    await components.start();
    await components.stop();
    await components.destroy();
    expect(components.isInit).toBe(false);
  });

  /**
   * Test: Entry should handle multiple pause/unpause cycles.
   * Ensures consistent toggle behavior across multiple pause calls.
   */
  test('should handle multiple pause/unpause', async () => {
    const components = entry['components'];
    if (!components) throw new Error('Components not created');
    
    await components.init(componentsConfig);
    await components.start();
    await components.pause(); // Pause
    expect(components.isPaused).toBe(true);
    await components.pause(); // Unpause
    expect(components.isPaused).toBe(false);
    await components.pause(); // Pause again
    expect(components.isPaused).toBe(true);
  });
});
