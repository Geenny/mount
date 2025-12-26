import { Subject } from 'rxjs';
import { BaseService } from '../base/BaseService';

export class DependencyService extends BaseService {
  protected subject = new Subject();

  constructor() {
    super({ ID: 'dependencyService', name: 'DependencyService' });
  }

  get observable() {
    return this.subject.asObservable();
  }

  emit(value: any) {
    this.subject.next(value);
  }
}