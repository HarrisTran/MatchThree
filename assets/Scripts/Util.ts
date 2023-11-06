import { Vec3, math } from "cc";
import { Grid2D } from "./Match3Component/Grid2D";

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

export function convertTo1DArray<T>(arr: T[][]) : T[]{
    let result : T[] = [];
    for(let i of arr){
        for(let j of i){
            result.push(j);
        }
    }
    return result;
}

/**
* This function check if array of point is on single line.
* @param {Grid2D []} arrayPoints
* @returns {number} Return 1 if horizonal, 0 if vertical and -1 if non collinear
* @author HarrisTran
*/
export function areCollinearPoints(arrayPoints: Grid2D[]){
    const isHorizontal = arrayPoints.every(pos => pos.x === arrayPoints[0].x);
    const isVertical = arrayPoints.every(pos => pos.y === arrayPoints[0].y);
    if(isHorizontal){
        return 1;
    }else if(isVertical){
        return 0;
    }else{
        return -1;
    }
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
