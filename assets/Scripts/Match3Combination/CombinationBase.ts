import { Fruit, TypeFruit } from "../Match3Component/Fruit";
import { Grid2D } from "../Match3Component/Grid2D";

export class CombinationResult 
{
    public foundFruits : Array<Fruit>;
}

export abstract class FruitCombination
{
    public abstract LookupRange() : [number,number][][];
    public abstract Priority(): number;
    public abstract Test(fruit: Fruit): boolean;
    public abstract Points(): number;
    public abstract LookupChange(fruit: Fruit): void;

    public foundFruits : Fruit[] = new Array<Fruit>();
    public typeFruit : TypeFruit;

    public GetResult() : CombinationResult
    {
        let result : CombinationResult = new CombinationResult();
        result.foundFruits = this.foundFruits;
        return result;
    }
}