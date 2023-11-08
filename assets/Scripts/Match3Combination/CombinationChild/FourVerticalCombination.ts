import { Fruit } from "../../Match3Component/Fruit";
import { Grid2D } from "../../Match3Component/Grid2D";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class FourVerticalCombination extends FruitCombination {
    public readonly NAME : string = TypeCombination.FOUR_VERTICAL;
    public CombinationSize(): number 
    {
        return 4;
    }

    public LookupRange(): [number,number][][] 
    {
        return [
            [[1,0],
             [0,0],
             [2,0],
             [3,0]],
        ]
    }


    public Priority(): number {
        return 2;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.CanDestroy || this.foundFruits.length != this.CombinationSize()){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }
    public Points(): number {
        return 15;
    }
    
}

