import { math } from "cc";

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

export function randomInRange<T>(arr: T[]): T {
    if (arr.length == 0) {
        throw new Error("Array cannot be get random");
    }

    const length = arr.length;

    return arr[math.randomRangeInt(0,length)];
}

export class DistinctList<T>{
    private list: Array<T> = [];
    public constructor(){
        this.list = new Array<T>();
    }
    public add(item: T){
        if(this.list.indexOf(item) == -1){
            this.list.push(item);
        }
    }

    public clear(): void {
        this.list = [];
    }

    public size(): number{
        return this.list.length;
    }

    public getList(): Array<T>{
        return this.list;
    }
}
