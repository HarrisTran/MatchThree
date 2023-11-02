import { Vec3, math } from "cc";

export function convertTo2DArray<T>(arr: T[], rows: number, columns: number): T[][] {
    if (arr.length !== rows * columns) {
        throw new Error("Invalid input: 1D array cannot be evenly divided into 2D array.");
    }

    const result: T[][] = [];

    for (let i = 0; i < rows; i++) {
        result.push(arr.slice(i * columns, (i + 1) * columns));
    }

    return result;
}

export function areAllElementsSame<T, K extends keyof T>(arr: T[], attribute: K): boolean {
    if (arr.length === 0) {
        return true; // Return true if the array is empty
    }

    const firstElementValue = arr[0][attribute]; // Get the value of the attribute for the first element

    for (let i = 1; i < arr.length; i++) {
        if (arr[i][attribute] !== firstElementValue) {
            return false; // Return false if any elements have a different attribute value
        }
    }

    return true; // Return true if all elements have the same attribute value
}


export function randomInRange<T>(arr: T[]): T {
    if (arr.length == 0) {
        throw new Error("Array cannot be get random");
    }

    const length = arr.length;

    return arr[math.randomRangeInt(0, length)];
}

export function easingMovement(currentPosition: Vec3, expectPosition: Vec3, deltaT: number, easingFunction: (t: number) => number): Vec3 {
    const easingOutput = easingFunction(deltaT);

    return new Vec3(
        math.lerp(currentPosition.x, expectPosition.x, easingOutput),
        math.lerp(currentPosition.y, expectPosition.y, easingOutput),
        0
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
