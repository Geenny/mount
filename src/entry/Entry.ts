import { componentsConfig } from "config/config.component";
import { Components } from "core/component/Components";
import { ComponentConfigType } from "core/component/types";

declare global {
  interface Window {
    app?: Components;
  }
}

declare const __DEV__: boolean;

export class Entry {
  private components?: Components;

  constructor() {
    this.components = new Components();

    if (typeof window !== 'undefined' && __DEV__) {
      window.app = this.components;
    }
  }

  async start() {
    if (!this.components) return;

    const config = this.configGet();

    await this.components.init( config );
    await this.components.start();
  }

  /**
   * For overriden in subclasses to provide custom config
   * @returns @AppConfigType
   */
  configGet(): ComponentConfigType {
    return componentsConfig;
  }
}