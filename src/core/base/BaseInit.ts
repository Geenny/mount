import { BaseConfig } from './BaseConfig';
import { ConfigType } from './types';

export abstract class BaseInit extends BaseConfig {
  protected _isInit = false;

  constructor(config: ConfigType) {
    super(config);
  }

  public get isInit(): boolean {
    return this._isInit;
  }

  public get isDestroyed(): boolean {
    return !this._isInit;
  }

  async init(): Promise<void> {
    await this.onInit();
    this._isInit = true;
  }

  async destroy(): Promise<void> {
    await this.onDestroy();
    this._isInit = false;
  }

  protected async onInit(): Promise<void> {
    // Логика при инициализации
  }

  protected async onDestroy(): Promise<void> {
    // Логика при уничтожении
  }
}