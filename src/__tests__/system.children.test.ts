import { SystemVisibilityComponent } from '../core/components/system/components/visibility/SystemVisibilityComponent';
import { SystemResizeComponent } from '../core/components/system/components/resize/SystemResizeComponent';
import { SystemKeyboardComponent } from '../core/components/system/components/keyboard/SystemKeyboardComponent';
import { StreamComponent } from '../core/components/stream/StreamComponent';
import { ComponentNameEnum, ComponentSystemNameEnum, ComponentTypeEnum } from '../core/components/enums';
import { SubscribeTypeEnum, SubscribeActionEnum } from '../core/base/construction/subscription/enum';
import { SYSTEM_EVENT } from '../core/constants';

/**
 * Test suite for System child components: Visibility, Resize, and Keyboard.
 * These components listen to DOM events and emit them through StreamComponent.
 */
describe('System Child Components', () => {
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
  });

  afterEach(async () => {
    if (streamComponent.isInit) {
      await streamComponent.destroy();
    }
  });

  describe('SystemVisibilityComponent', () => {
    let visibilityComponent: SystemVisibilityComponent;

    beforeEach(async () => {
      visibilityComponent = new SystemVisibilityComponent();
      await visibilityComponent.init({
        name: ComponentSystemNameEnum.VISIBILITY,
        type: ComponentTypeEnum.SERVICE,
        unique: true,
      });

      visibilityComponent['subscriberSet'](ComponentNameEnum.STREAM, streamComponent);

      streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
        instance: visibilityComponent,
      });

      await visibilityComponent.start();
    });

    afterEach(async () => {
      if (visibilityComponent.isInit) {
        await visibilityComponent.destroy();
      }
    });

    test('should initialize correctly', () => {
      expect(visibilityComponent.isInit).toBe(true);
      expect(visibilityComponent.isWorking).toBe(true);
      expect(visibilityComponent.name).toBe(ComponentSystemNameEnum.VISIBILITY);
    });

    test('should emit visibility event when document visibility changes', () => {
      const mockMethod = jest.fn();

      // Subscribe to visibility events
      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: visibilityComponent,
        source: { event: SYSTEM_EVENT.VISIBILITY, method: mockMethod },
      });

      // Simulate visibility change by triggering the event
      const event = new Event('visibilitychange');
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: false,
      });
      document.dispatchEvent(event);

      expect(mockMethod).toHaveBeenCalled();
      expect(mockMethod).toHaveBeenCalledWith({ visible: true });
    });

    test('should emit correct visibility state when document is hidden', () => {
      const mockMethod = jest.fn();

      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: visibilityComponent,
        source: { event: SYSTEM_EVENT.VISIBILITY, method: mockMethod },
      });

      // Set document as hidden
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: true,
      });

      const event = new Event('visibilitychange');
      document.dispatchEvent(event);

      expect(mockMethod).toHaveBeenCalledWith({ visible: false });
    });
  });

  describe('SystemResizeComponent', () => {
    let resizeComponent: SystemResizeComponent;

    beforeEach(async () => {
      resizeComponent = new SystemResizeComponent();
      await resizeComponent.init({
        name: ComponentSystemNameEnum.RESIZE,
        type: ComponentTypeEnum.SERVICE,
        unique: true,
      });

      resizeComponent['subscriberSet'](ComponentNameEnum.STREAM, streamComponent);

      streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
        instance: resizeComponent,
      });

      await resizeComponent.start();
    });

    afterEach(async () => {
      if (resizeComponent.isInit) {
        await resizeComponent.destroy();
      }
    });

    test('should initialize correctly', () => {
      expect(resizeComponent.isInit).toBe(true);
      expect(resizeComponent.isWorking).toBe(true);
      expect(resizeComponent.name).toBe(ComponentSystemNameEnum.RESIZE);
    });

    test('should emit resize event when window is resized', () => {
      const mockMethod = jest.fn();

      // Subscribe to resize events
      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: resizeComponent,
        source: { event: SYSTEM_EVENT.RESIZE, method: mockMethod },
      });

      // Simulate window resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      });

      window.dispatchEvent(new Event('resize'));

      expect(mockMethod).toHaveBeenCalled();
      expect(mockMethod).toHaveBeenCalledWith({
        width: 1024,
        height: 768,
      });
    });

    test('should emit correct dimensions on multiple resize events', () => {
      const mockMethod = jest.fn();

      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: resizeComponent,
        source: { event: SYSTEM_EVENT.RESIZE, method: mockMethod },
      });

      // First resize
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 600, writable: true, configurable: true });
      window.dispatchEvent(new Event('resize'));

      // Second resize
      Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true, configurable: true });
      window.dispatchEvent(new Event('resize'));

      expect(mockMethod).toHaveBeenCalledTimes(2);
      expect(mockMethod).toHaveBeenNthCalledWith(1, { width: 800, height: 600 });
      expect(mockMethod).toHaveBeenNthCalledWith(2, { width: 1920, height: 1080 });
    });
  });

  describe('SystemKeyboardComponent', () => {
    let keyboardComponent: SystemKeyboardComponent;

    beforeEach(async () => {
      keyboardComponent = new SystemKeyboardComponent();
      await keyboardComponent.init({
        name: ComponentSystemNameEnum.KEYBOARD,
        type: ComponentTypeEnum.SERVICE,
        unique: true,
      });

      keyboardComponent['subscriberSet'](ComponentNameEnum.STREAM, streamComponent);

      streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
        instance: keyboardComponent,
      });

      await keyboardComponent.start();
    });

    afterEach(async () => {
      if (keyboardComponent.isInit) {
        await keyboardComponent.destroy();
      }
    });

    test('should initialize correctly', () => {
      expect(keyboardComponent.isInit).toBe(true);
      expect(keyboardComponent.isWorking).toBe(true);
      expect(keyboardComponent.name).toBe(ComponentSystemNameEnum.KEYBOARD);
    });

    test('should emit keyboard event on keydown', () => {
      const mockMethod = jest.fn();

      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: keyboardComponent,
        source: { event: SYSTEM_EVENT.KEYBOARD, method: mockMethod },
      });

      // Simulate keydown event
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 13,
        shiftKey: false,
        ctrlKey: true,
        altKey: false,
      });
      window.dispatchEvent(keyEvent);

      expect(mockMethod).toHaveBeenCalled();
      expect(mockMethod).toHaveBeenCalledWith({
        action: 'down',
        key: 'Enter',
        code: 13,
        isShift: false,
        isCtrl: true,
        isAlt: false,
      });
    });

    test('should emit keyboard event on keyup', () => {
      const mockMethod = jest.fn();

      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: keyboardComponent,
        source: { event: SYSTEM_EVENT.KEYBOARD, method: mockMethod },
      });

      // Simulate keyup event
      const keyEvent = new KeyboardEvent('keyup', {
        key: 'A',
        keyCode: 65,
        shiftKey: true,
        ctrlKey: false,
        altKey: false,
      });
      window.dispatchEvent(keyEvent);

      expect(mockMethod).toHaveBeenCalledWith({
        action: 'up',
        key: 'A',
        code: 65,
        isShift: true,
        isCtrl: false,
        isAlt: false,
      });
    });

    test('should handle multiple key events', () => {
      const mockMethod = jest.fn();

      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: keyboardComponent,
        source: { event: SYSTEM_EVENT.KEYBOARD, method: mockMethod },
      });

      // Keydown
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', keyCode: 16 }));
      
      // Keyup
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift', keyCode: 16 }));

      expect(mockMethod).toHaveBeenCalledTimes(2);
      expect(mockMethod).toHaveBeenNthCalledWith(1, expect.objectContaining({ action: 'down', key: 'Shift' }));
      expect(mockMethod).toHaveBeenNthCalledWith(2, expect.objectContaining({ action: 'up', key: 'Shift' }));
    });

    test('should capture modifier keys correctly', () => {
      const mockMethod = jest.fn();

      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: keyboardComponent,
        source: { event: SYSTEM_EVENT.KEYBOARD, method: mockMethod },
      });

      // All modifiers pressed
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'S',
        keyCode: 83,
        shiftKey: true,
        ctrlKey: true,
        altKey: true,
      });
      window.dispatchEvent(keyEvent);

      expect(mockMethod).toHaveBeenCalledWith({
        action: 'down',
        key: 'S',
        code: 83,
        isShift: true,
        isCtrl: true,
        isAlt: true,
      });
    });
  });

  describe('Integration: All System Components Working Together', () => {
    let visibilityComponent: SystemVisibilityComponent;
    let resizeComponent: SystemResizeComponent;
    let keyboardComponent: SystemKeyboardComponent;

    beforeEach(async () => {
      // Initialize all system components
      visibilityComponent = new SystemVisibilityComponent();
      resizeComponent = new SystemResizeComponent();
      keyboardComponent = new SystemKeyboardComponent();

      const components = [visibilityComponent, resizeComponent, keyboardComponent];
      const names = [
        ComponentSystemNameEnum.VISIBILITY,
        ComponentSystemNameEnum.RESIZE,
        ComponentSystemNameEnum.KEYBOARD,
      ];

      for (let i = 0; i < components.length; i++) {
        await components[i].init({
          name: names[i],
          type: ComponentTypeEnum.SERVICE,
          unique: true,
        });

        components[i]['subscriberSet'](ComponentNameEnum.STREAM, streamComponent);

        streamComponent.onMessage(SubscribeTypeEnum.SYSTEM, SubscribeActionEnum.START, {
          instance: components[i],
        });

        await components[i].start();
      }
    });

    afterEach(async () => {
      const components = [visibilityComponent, resizeComponent, keyboardComponent];
      for (const component of components) {
        if (component.isInit) {
          await component.destroy();
        }
      }
    });

    test('all components should work independently and simultaneously', () => {
      const visibilityMock = jest.fn();
      const resizeMock = jest.fn();
      const keyboardMock = jest.fn();

      // Subscribe to all events
      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: visibilityComponent,
        source: { event: SYSTEM_EVENT.VISIBILITY, method: visibilityMock },
      });

      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: resizeComponent,
        source: { event: SYSTEM_EVENT.RESIZE, method: resizeMock },
      });

      streamComponent.onMessage(SubscribeTypeEnum.SUBSCRIBE, SubscribeActionEnum.START, {
        instance: keyboardComponent,
        source: { event: SYSTEM_EVENT.KEYBOARD, method: keyboardMock },
      });

      // Trigger all events
      document.dispatchEvent(new Event('visibilitychange'));
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'X' }));

      // Verify all were called
      expect(visibilityMock).toHaveBeenCalled();
      expect(resizeMock).toHaveBeenCalled();
      expect(keyboardMock).toHaveBeenCalled();
    });
  });
});
