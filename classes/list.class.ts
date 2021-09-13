export class List<T> extends Array<T> {
  static fromObject<Y>(obj: any) {
    if (!obj || Object.keys(obj).length <= 0)
      return new List<Y>();

    return new List<Y>(...Object.values(obj) as Y[]);
  }
  get(index: number): T {
    return this[index];
  }
  first(): T {
    return this[0];
  }
  last(): T {
    return this[this.length - 1];
  }
}