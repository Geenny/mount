import { StreamSubscribeComponent } from '../core/components/subscribe/StreamSubscribeComponent';
import { StreamComponent } from '../core/components/stream/StreamComponent';
import { ComponentNameEnum, ComponentTypeEnum } from '../core/components/enums';
import { SubscribeTypeEnum, SubscribeActionEnum } from '../core/base/construction/subscription/enum';

/**
 * Test suite for StreamSubscribeComponent.
 * Tests cover emit functionality through StreamComponent.
 */
describe('StreamSubscribeComponent', () => {
  let subscribeComponent: StreamSubscribeComponent;
  let streamComponent: StreamComponent;

  beforeEach(async () => {
    // Create and initialize StreamComponent
    streamComponent = new StreamComponent();
    await streamComponent.init({
      name: ComponentNameEnum.STREAM,
      type: ComponentTypeEnum.SERVICE,
      unique: true,
    });
    await streamComponent.start();

    // Create StreamSubscribeComponent
    subscribeComponent = new StreamSubscribeComponent();
    await subscribeComponent.init({
      name: 'TEST_SUBSCRIBE',
      type: ComponentTypeEnum.COMPONENT,
      unique: true,
    });

    // Set StreamComponent as subscriber
    subscribeComponent['subscriberSet'](ComponentNameEnum.STREAM, streamComponent);

    // Register subscribeComponent in StreamComponent
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: subscribeComponent,
    });
  });

  afterEach(async () => {
    if (subscribeComponent.isInit) {
      await subscribeComponent.destroy();
    }
    if (streamComponent.isInit) {
      await streamComponent.destroy();
    }
  });

  /**
   * Test: Should initialize correctly
   */
  test('should initialize correctly', () => {
    expect(subscribeComponent.isInit).toBe(true);
    expect(subscribeComponent.name).toBe('TEST_SUBSCRIBE');
  });

  /**
   * Test: Should emit events through StreamComponent
   */
  test('should emit events through StreamComponent', () => {
    const event = 'test.event';
    const testData = { value: 'test' };
    const mockMethod = jest.fn();

    // Subscribe another component to the event
    const anotherComponent = new StreamSubscribeComponent();
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: anotherComponent,
    });

    streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
      instance: anotherComponent,
      source: { event, method: mockMethod },
    });

    // Emit event from subscribeComponent
    subscribeComponent.emit(event, testData);

    // Verify the event was received
    expect(mockMethod).toHaveBeenCalledWith(testData);
  });

  /**
   * Test: Should handle emit when StreamComponent is not found
   */
  test('should handle emit when StreamComponent is not found', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Create new component without stream subscription
    const isolatedComponent = new StreamSubscribeComponent();
    isolatedComponent['subscriberMap'] = new Map();

    isolatedComponent.emit('test.event', {});

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  /**
   * Test: Should cache StreamComponent reference
   */
  test('should cache StreamComponent reference after first emit', () => {
    const event = 'cache.test';
    const mockMethod = jest.fn();

    // Subscribe to event
    streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
      instance: subscribeComponent,
      source: { event, method: mockMethod },
    });

    // First emit - should find and cache StreamComponent
    subscribeComponent.emit(event, { first: true });

    // Second emit - should use cached reference
    subscribeComponent.emit(event, { second: true });

    expect(mockMethod).toHaveBeenCalledTimes(2);
    expect(mockMethod).toHaveBeenNthCalledWith(1, { first: true });
    expect(mockMethod).toHaveBeenNthCalledWith(2, { second: true });
  });

  /**
   * Test: Should support subscribe method
   */
  test('should support subscribe method through base component', () => {
    const event = 'subscribe.test';
    const mockMethod = jest.fn();

    // Subscribe using component's subscribe method
    subscribeComponent.subscribe(event, mockMethod);

    // Emit through StreamComponent
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: subscribeComponent,
      source: { event, data: { test: 'data' } },
    });

    expect(mockMethod).toHaveBeenCalledWith({ test: 'data' });
  });

  /**
   * Test: Should support unsubscribe method
   */
  test('should support unsubscribe method through base component', () => {
    const event = 'unsubscribe.test';
    const mockMethod = jest.fn();

    // Subscribe and then unsubscribe
    subscribeComponent.subscribe(event, mockMethod);
    subscribeComponent.unsubscribe(event, mockMethod);

    // Emit event - should not be called
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: subscribeComponent,
      source: { event, data: {} },
    });

    expect(mockMethod).not.toHaveBeenCalled();
  });
});
