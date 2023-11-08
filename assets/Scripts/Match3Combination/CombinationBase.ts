import { Fruit, TypeFruit } from "../Match3Component/Fruit";
import { Grid2D } from "../Match3Component/Grid2D";

export const TypeCombination = {
    FIVE_HORIZONAL : "Five_Horizonal",
    FIVE_VERTICAL : "Five_Vertical",
    FOUR_HORIZONAL : "Four_Horizonal",
    FOUR_VERTICAL : "Four_Vertical",
    LSHAPE : "LShape",
    THREE_HORIZONAL: "Three_Horizonal",
    THREE_VERTICAL : "Three_Vertical",
    TSHAPE: "TShape"
}
export class CombinationResult 
{
    public typeCombination : FruitCombination;
    public foundFruits : Array<Fruit>;
}

export abstract class FruitCombination
{
    public abstract LookupRange() : [number,number][][];
    public abstract Priority(): number;
    public abstract Test(fruit: Fruit): boolean;
    public abstract Points(): number;
    public abstract CombinationSize(): number;

    public readonly NAME : string = "";
    public foundFruits : Fruit[] = new Array<Fruit>();
    public typeFruit : TypeFruit;

    public GetResult() : CombinationResult
    {
        let result : CombinationResult = new CombinationResult();
        result.foundFruits = this.foundFruits;
        result.typeCombination = this;
        return result;
    }

    public LookupChange(fruit: Fruit)
    {
        fruit.CanDestroy = true;
    }
}