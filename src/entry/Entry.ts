// import { App } from 'app/App';
// import { AppConfigType } from 'config/types';
// import { appConfig } from 'config/config.app';

import { componentsConfig } from "config/config.component";
import { Components } from "core/component/Components";
import { ComponentConfigType } from "core/component/types";

declare global {
  interface Window {
    components?: Components;
  }
}

export class Entry {
  // private app?: App;
  private components?: Components;

  constructor() {
    // this.app = new App();
    this.components = new Components();
    
    // if ( this.app.isDebug && typeof window !== 'undefined' )
    //   window.app = this.app;
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