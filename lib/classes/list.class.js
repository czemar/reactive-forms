export class List extends Array {
    static fromObject(obj) {
        if (!obj || Object.keys(obj).length <= 0)
            return new List();
        return new List(...Object.values(obj));
    }
    get(index) {
        return this[index];
    }
    first() {
        return this[0];
    }
    last() {
        return this[this.length - 1];
    }
}
