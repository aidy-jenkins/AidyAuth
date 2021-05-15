export class Lazy {
    constructor(factory) {
        this.factory = factory;
        this.calculated = false;
    }
    get value() {
        if (!this.calculated) {
            this._value = this.factory();
            this.calculated = true;
        }
        return this._value;
    }
}
