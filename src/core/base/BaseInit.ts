import { BaseConfig } from './BaseConfig';
import { ConfigType } from './types';

export abstract class BaseInit extends BaseConfig {
  constructor(config: ConfigType) {
    super(config);
  }

  async init(): Promise<void> {
    // Логика инициализации
  }

  async destroy(): Promise<void> {
    // Логика уничтожения
  }
}