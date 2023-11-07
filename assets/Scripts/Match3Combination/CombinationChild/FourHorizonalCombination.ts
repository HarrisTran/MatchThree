import { Fruit } from "../../Match3Component/Fruit";
import { Grid2D } from "../../Match3Component/Grid2D";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class FourHorizonalCombination extends FruitCombination {

    public readonly NAME : string = TypeCombination.FOUR_HORIZONAL;
    
    public CombinationSize(): number 
    {
        return 4;
    }

    public LookupRange(): [number,number][][] 
    {
        return [
            [[0,1],[0,0],[0,2],[0,3]],
        ]
    }
    public Priority(): number 
    {
        return 2;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.inCombination|| this.foundFruits.length != this.CombinationSize()){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }

    public Points(): number {
        return 15;
    }
    
}

