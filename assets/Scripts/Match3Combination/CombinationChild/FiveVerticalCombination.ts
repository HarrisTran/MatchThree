import { Fruit } from "../../Match3Component/Fruit";
import { Grid2D } from "../../Match3Component/Grid2D";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class FiveVerticalCombination extends FruitCombination {

    public readonly NAME : string = TypeCombination.FIVE_VERTICAL;

    public CombinationSize(): number 
    {
        return 5;
    }

    public LookupRange(): [number,number][][] 
    {
        return [
            [[2,0],
             [1,0],
             [0,0],
             [3,0],
             [4,0]],
        ]
    }


    public Priority(): number 
    {
        return 4;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.CanDestroy || this.foundFruits.length != this.CombinationSize()){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }

    public Points(): number 
    {
        return 20;
    }
    
}

