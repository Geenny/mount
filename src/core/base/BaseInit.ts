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

  init(): this {
    this.onInit();
    this._isInit = true;
    return this;
  }

  destroy(): void {
    this.onDestroy();
    this._isInit = false;
  }

  protected onInit(): void {
    // Логика при инициализации
  }

  protected onDestroy(): void {
    // Логика при уничтожении
  }
}