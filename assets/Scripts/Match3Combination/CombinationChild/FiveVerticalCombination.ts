import { Fruit } from "../../Match3Component/Fruit";
import { Grid2D } from "../../Match3Component/Grid2D";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class FiveVerticalCombination extends FruitCombination {

    public nameOfCombination: TypeCombination = TypeCombination.FIVE_VERTICAL;

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


    public CombinationSize(): number {
        return 5;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.CanDestroy || this.foundFruits.length != 5){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }
    
}

