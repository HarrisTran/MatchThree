import { Fruit } from "../../Match3Component/Fruit";
import { Grid2D } from "../../Match3Component/Grid2D";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class FourHorizonalCombination extends FruitCombination {

    public nameOfCombination: TypeCombination = TypeCombination.FOUR_HORIZONAL;
    

    public LookupRange(): [number,number][][] 
    {
        return [
            [[0,1],[0,0],[0,2],[0,3]],
        ]
    }

    public CombinationSize(): number {
        return 4;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.CanDestroy || this.foundFruits.length != 4){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }
}

