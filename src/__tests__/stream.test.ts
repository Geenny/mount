import { StreamComponent } from '../core/components/stream/StreamComponent';
import { BaseComponent } from '../core/base/construction/component/BaseComponent';
import { ComponentNameEnum, ComponentTypeEnum } from '../core/components/enums';
import { SubscribeTypeEnum, SubscribeActionEnum } from '../core/base/construction/subscription/enum';

/**
 * Test suite for StreamComponent.
 * Tests cover messaging, subscriptions, instance management, and event emission.
 */
describe('StreamComponent', () => {
  let streamComponent: StreamComponent;
  let mockComponent: BaseComponent;

  beforeEach(async () => {
    streamComponent = new StreamComponent();
    await streamComponent.init({
      name: ComponentNameEnum.STREAM,
      type: ComponentTypeEnum.SERVICE,
      unique: true,
    });
    await streamComponent.start();

    // Create mock component for testing
    mockComponent = new BaseComponent();
    await mockComponent.init({
      name: 'MOCK_COMPONENT',
      type: ComponentTypeEnum.COMPONENT,
      unique: true,
    });
  });

  afterEach(async () => {
    if (streamComponent.isInit) {
      await streamComponent.destroy();
    }
  });

  /**
   * Test: StreamComponent should initialize and start correctly
   */
  test('should initialize and start correctly', () => {
    expect(streamComponent.isInit).toBe(true);
    expect(streamComponent.isWorking).toBe(true);
    expect(streamComponent.name).toBe(ComponentNameEnum.STREAM);
  });

  /**
   * Test: Should register instance via SYSTEM START message
   */
  test('should register instance via SYSTEM START message', () => {
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: mockComponent,
    });

    // Verify instance was registered by checking if View has it
    const view = streamComponent['view'];
    expect(view?.isExist(mockComponent)).toBe(true);
  });

  /**
   * Test: Should remove instance via SYSTEM STOP message
   */
  test('should remove instance via SYSTEM STOP message', () => {
    // First register the instance
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: mockComponent,
    });

    const view = streamComponent['view'];
    expect(view?.isExist(mockComponent)).toBe(true);

    // Then remove it
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.STOP, {
      instance: mockComponent,
    });

    expect(view?.isExist(mockComponent)).toBe(false);
  });

  /**
   * Test: Should handle subscription via SUBSCRIBE message
   */
  test('should handle subscription via SUBSCRIBE message', () => {
    const event = 'test.event';
    const mockMethod = jest.fn();

    // First register the instance
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: mockComponent,
    });

    // Then subscribe to event
    streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
      instance: mockComponent,
      source: { event, method: mockMethod },
    });

    // Verify subscription by checking View
    const view = streamComponent['view'];
    const subscribers = view?.byEventGet(event);
    expect(subscribers?.length).toBe(1);
    expect(subscribers?.[0].method).toBe(mockMethod);
  });

  /**
   * Test: Should emit data to subscribed instances
   */
  test('should emit data to subscribed instances', () => {
    const event = 'test.event';
    const testData = { value: 42 };
    const mockMethod = jest.fn();

    // Register instance
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: mockComponent,
    });

    // Subscribe to event
    streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
      instance: mockComponent,
      source: { event, method: mockMethod },
    });

    // Emit data via DATA message
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: mockComponent,
      source: { event, data: testData },
    });

    // Verify method was called with data
    expect(mockMethod).toHaveBeenCalledWith(testData);
    expect(mockMethod).toHaveBeenCalledTimes(1);
  });

  /**
   * Test: Should handle unsubscription
   */
  test('should handle unsubscription via SUBSCRIBE STOP message', () => {
    const event = 'test.event';
    const mockMethod = jest.fn();

    // Register and subscribe
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: mockComponent,
    });

    streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
      instance: mockComponent,
      source: { event, method: mockMethod },
    });

    // Unsubscribe
    streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.STOP, {
      instance: mockComponent,
      source: { event, method: mockMethod },
    });

    // Emit data - method should not be called
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: mockComponent,
      source: { event, data: { test: true } },
    });

    expect(mockMethod).not.toHaveBeenCalled();
  });

  /**
   * Test: Should support multiple subscribers for same event
   */
  test('should support multiple subscribers for same event', () => {
    const event = 'test.event';
    const testData = { value: 100 };
    const mockMethod1 = jest.fn();
    const mockMethod2 = jest.fn();

    const mockComponent2 = new BaseComponent();

    // Register instances
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: mockComponent,
    });
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: mockComponent2,
    });

    // Subscribe both
    streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
      instance: mockComponent,
      source: { event, method: mockMethod1 },
    });
    streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
      instance: mockComponent2,
      source: { event, method: mockMethod2 },
    });

    // Emit data
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: mockComponent,
      source: { event, data: testData },
    });

    // Both should be called
    expect(mockMethod1).toHaveBeenCalledWith(testData);
    expect(mockMethod2).toHaveBeenCalledWith(testData);
  });

  /**
   * Test: Should not allow component to send message to itself
   */
  test('should reject self-messaging', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: streamComponent,
      source: { event: 'test', data: {} },
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
