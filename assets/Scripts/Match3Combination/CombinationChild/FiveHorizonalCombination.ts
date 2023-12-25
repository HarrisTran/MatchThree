import { Fruit } from "../../Match3Component/Fruit";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class FiveHorizonalCombination extends FruitCombination {
    public nameOfCombination: TypeCombination = TypeCombination.FIVE_HORIZONAL;
    
    public LookupRange(): [number,number][][] 
    {
        return [
            [[0,2],[0,1],[0,0],[0,3],[0,4]],
        ];
    }

    public CombinationSize(): number {
        return 5;
    }


    public Test(fruit: Fruit): boolean 
    {
        if(fruit.CanDestroy  || this.foundFruits.length != 5){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }

}

