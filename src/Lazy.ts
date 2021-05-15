export class Lazy<T> {
    constructor(private factory: () => T) {

    }

    private _value: T;
    private calculated = false;

    public get value() {
        if(!this.calculated) {
            this._value = this.factory();
            this.calculated = true;
        }

        return this._value;
    }
}