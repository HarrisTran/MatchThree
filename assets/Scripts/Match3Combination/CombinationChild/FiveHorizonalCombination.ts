import { Fruit } from "../../Match3Component/Fruit";
import { Grid2D } from "../../Match3Component/Grid2D";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class FiveHorizonalCombination extends FruitCombination {

    public readonly NAME : string = TypeCombination.FIVE_HORIZONAL;

    public CombinationSize(): number 
    {
        return 5;
    }

    public LookupRange(): [number,number][][] 
    {
        return [
            [[0,2],[0,1],[0,0],[0,3],[0,4]],
        ];
    }

    public Priority(): number 
    {
        return 4;
    }


    public Test(fruit: Fruit): boolean 
    {
        if(fruit.inCombination  || this.foundFruits.length != this.CombinationSize()){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }

    public Points(): number 
    {
        return 20;
    }
    
}

