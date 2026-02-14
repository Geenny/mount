import { SystemComponent } from '../core/components/system/SystemComponent';
import { StreamComponent } from '../core/components/stream/StreamComponent';
import { ComponentNameEnum, ComponentSystemNameEnum, ComponentTypeEnum } from '../core/components/enums';
import { SubscribeTypeEnum, SubscribeActionEnum } from '../core/base/construction/subscription/enum';
import { SYSTEM_EVENT } from '../core/constants';
import { SystemVisibleDataType, SystemKeyboardDataType, SystemResizeDataType } from '../core/components/system/types';

/**
 * Test suite for SystemComponent.
 * Tests cover system event subscriptions and model updates.
 */
describe('SystemComponent', () => {
  let systemComponent: SystemComponent;
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

    // Create and initialize SystemComponent
    systemComponent = new SystemComponent();
    await systemComponent.init({
      name: ComponentNameEnum.SYSTEM,
      type: ComponentTypeEnum.SERVICE,
      unique: true,
    });

    // Set StreamComponent as subscriber
    systemComponent['subscriberSet'](ComponentNameEnum.STREAM, streamComponent);

    // Register SystemComponent in StreamComponent
    streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
      instance: systemComponent,
    });

    await systemComponent.start();
  });

  afterEach(async () => {
    if (systemComponent.isInit) {
      await systemComponent.destroy();
    }
    if (streamComponent.isInit) {
      await streamComponent.destroy();
    }
  });

  /**
   * Test: Should initialize and start correctly
   */
  test('should initialize and start correctly', () => {
    expect(systemComponent.isInit).toBe(true);
    expect(systemComponent.isWorking).toBe(true);
    expect(systemComponent.name).toBe(ComponentNameEnum.SYSTEM);
  });

  /**
   * Test: Should subscribe to VISIBILITY events and update model
   */
  test('should subscribe to VISIBILITY events and update model', () => {
    const visibilityData: SystemVisibleDataType = { visible: true };

    // Emit visibility event through StreamComponent
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: systemComponent,
      source: {
        event: SYSTEM_EVENT.VISIBILITY,
        data: visibilityData,
      },
    });

    // Verify model was updated
    const model = systemComponent['model'];
    expect(model?.visibility).toEqual(visibilityData);
  });

  /**
   * Test: Should subscribe to KEYBOARD events and update model
   */
  test('should subscribe to KEYBOARD events and update model', () => {
    const keyboardData: SystemKeyboardDataType = {
      action: 'down',
      key: 'Enter',
      code: 13,
      isShift: false,
      isCtrl: false,
      isAlt: false,
    };

    // Emit keyboard event
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: systemComponent,
      source: {
        event: SYSTEM_EVENT.KEYBOARD,
        data: keyboardData,
      },
    });

    // Verify model was updated
    const model = systemComponent['model'];
    expect(model?.keyboard).toEqual(keyboardData);
  });

  /**
   * Test: Should subscribe to RESIZE events and update model
   */
  test('should subscribe to RESIZE events and update model', () => {
    const resizeData: SystemResizeDataType = {
      width: 1920,
      height: 1080,
    };

    // Emit resize event
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: systemComponent,
      source: {
        event: SYSTEM_EVENT.RESIZE,
        data: resizeData,
      },
    });

    // Verify model was updated
    const model = systemComponent['model'];
    expect(model?.resize).toEqual(resizeData);
  });

  /**
   * Test: Should trigger onModelChange when model is updated
   */
  test('should trigger onModelChange when model is updated', () => {
    const controller = systemComponent['controller'];
    const onModelChangeSpy = jest.spyOn(controller as any, 'onModelChange');

    const visibilityData: SystemVisibleDataType = { visible: false };

    // Emit event
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: systemComponent,
      source: {
        event: SYSTEM_EVENT.VISIBILITY,
        data: visibilityData,
      },
    });

    expect(onModelChangeSpy).toHaveBeenCalledWith('visibility', visibilityData);
  });

  /**
   * Test: Should handle multiple event types sequentially
   */
  test('should handle multiple event types sequentially', () => {
    const visibilityData: SystemVisibleDataType = { visible: true };
    const keyboardData: SystemKeyboardDataType = {
      action: 'up',
      key: 'A',
      code: 65,
      isShift: true,
      isCtrl: false,
      isAlt: false,
    };
    const resizeData: SystemResizeDataType = { width: 800, height: 600 };

    // Emit all events
    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: systemComponent,
      source: { event: SYSTEM_EVENT.VISIBILITY, data: visibilityData },
    });

    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: systemComponent,
      source: { event: SYSTEM_EVENT.KEYBOARD, data: keyboardData },
    });

    streamComponent.onMessage(SubscribeTypeEnum.DATA, SubscribeActionEnum.START, {
      instance: systemComponent,
      source: { event: SYSTEM_EVENT.RESIZE, data: resizeData },
    });

    // Verify all model properties were updated
    const model = systemComponent['model'];
    expect(model?.visibility).toEqual(visibilityData);
    expect(model?.keyboard).toEqual(keyboardData);
    expect(model?.resize).toEqual(resizeData);
  });

  /**
   * Test: Model properties should have default values initially
   */
  test('model properties should have default values initially', () => {
    const model = systemComponent['model'];
    // Check that getters return default values before events are received
    expect(model?.visibility).toBe(false);
    expect(model?.keyboard).toBeUndefined();
    expect(model?.resize).toBeUndefined();
  });
});
