import { output } from 'utils/index';
import { BaseConfig } from './BaseConfig';
import { ConfigType } from './types';

export abstract class BaseInit extends BaseConfig {
  protected _isInit = false;

  public get isInit(): boolean {
    return this._isInit;
  }

  public get isDestroyed(): boolean {
    return !this._isInit;
  }

  async init( config?: ConfigType ): Promise<void> {
    if ( this.isInit ) {
      await this.destroy();
      this._isInit = false;
    }

    this.configure( config );

    if ( this.isConfigApproved ) {
      await this.onInit();
      this._isInit = true;
    } else {
      output.error( this, 'Configuration not approved:', this.config );
    }
  }

  async destroy(): Promise<void> {
    if ( !this.isInit ) {
      output.warn( this, 'Cannot destroy: not initialized' );
      return;
    }
    
    await this.onDestroy();

    this.unconfigure();

    this._isInit = false;
  }

  protected async onInit(): Promise<void> {
    // Логика при инициализации
  }

  protected async onDestroy(): Promise<void> {
    // Логика при уничтожении
  }
}