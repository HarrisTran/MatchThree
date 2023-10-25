import { Grid2D } from "./Grid2D";
export enum MatchType{
    NORMAL = "normal",
    QUADRUPLE = "quadruple",
    QUINTUPLE = "quintyuple",
}
export class Match {
    public coordinates: Grid2D;

    public type : MatchType;

    public constructor(coordinate: Grid2D, typeMatch: MatchType)
    {
        this.coordinates = coordinate;
        this.type = typeMatch;
    }
}


