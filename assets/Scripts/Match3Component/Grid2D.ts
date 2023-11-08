export class Grid2D  {
    x: number;
    y: number;

    constructor(x: number, y:number){
        this.x = x;
        this.y = y;
    }

    public add(other: Grid2D){
        return new Grid2D(this.x + other.x, this.y + other.y);
    }

    public clone(){
        return new Grid2D(this.x, this.y);
    }

    public compareTo(other : Grid2D){
        if(!other) return false;
        return this.x === other.x && this.y === other.y;
    }
}
