import { Subject } from 'rxjs';

export class DependencyService {
  protected subject = new Subject();

  constructor() {}

  get observable() {
    return this.subject.asObservable();
  }

  emit(value: any) {
    this.subject.next(value);
  }
}