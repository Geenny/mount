import { Subject } from 'rxjs';
export declare class DependencyService {
    protected subject: Subject<unknown>;
    constructor();
    get observable(): import("rxjs").Observable<unknown>;
    emit(value: any): void;
}
