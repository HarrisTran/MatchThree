import { Vec3, easing, math } from "cc";

export function convertTo2DArray(arr: Vec3[], rows: number, columns: number): Vec3[][] {
    if (arr.length !== rows * columns) {
        throw new Error("Invalid input: 1D array cannot be evenly divided into 2D array.");
    }
    const result: Vec3[][] = [];
    for (let i = 0; i < rows; i++) {
        result.push(arr.slice(i * columns, (i + 1) * columns));
    }
    return result;
}

export function convertTo1DArray<T>(arr: T[][]) : T[]{
    let result : T[] = [];
    for(let i of arr){
        for(let j of i){
            result.push(j);
        }
    }
    return result;
}


export function randomInRange<T>(arr: T[]): T {
    if (arr.length == 0) {
        throw new Error("Array cannot be get random");
    }

    const length = arr.length;

    return arr[math.randomRangeInt(0, length)];
}

export function easingMovement(currentPosition: Vec3, expectPosition: Vec3, dt: number): Vec3 {
    const easingOutput = easing.smooth(16*dt)

    return new Vec3(
        math.lerp(currentPosition.x, expectPosition.x, easingOutput),
        math.lerp(currentPosition.y, expectPosition.y, easingOutput)
    );
}


export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export class DistinctList<T>{
    private list: Array<T> = [];
    public constructor() {
        this.list = new Array<T>();
    }
    public add(item: T) {
        if (this.list.indexOf(item) == -1) {
            this.list.push(item);
        }
    }

    public clear(): void {
        this.list = [];
    }

    public size(): number {
        return this.list.length;
    }

    public getList(): Array<T> {
        return this.list;
    }
}
