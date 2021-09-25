export declare class List<T> extends Array<T> {
    static fromObject<Y>(obj: any): List<Y>;
    get(index: number): T;
    first(): T;
    last(): T;
}
