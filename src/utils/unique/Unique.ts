export class Unique {

    private current: number = 0;

    constructor( startFrom: number = 0 ) {
        this.current = startFrom;
    }

    next(): number {
        return this.current ++;
    }

}