import { Fruit } from "../../Match3Component/Fruit";
import { Grid2D } from "../../Match3Component/Grid2D";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class ThreeHorizonalCombination extends FruitCombination {
  
    
    public nameOfCombination: TypeCombination = TypeCombination.THREE_HORIZONAL;
    
   
    public LookupRange(): [number,number][][] 
    {
        return [
            [[0,0],[0,1],[0,2]]
        ]
    }

    public CombinationSize(): number {
        return 3;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.CanDestroy || this.foundFruits.length != 3){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }
   
}

