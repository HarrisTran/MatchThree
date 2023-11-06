import { Fruit } from "../../Match3Component/Fruit";
import { FruitCombination } from "../CombinationBase";

export class ThreeVerticalCombination extends FruitCombination {
    public LookupChange(fruit: Fruit): void 
    {
        fruit.lookupVertical = true;
    }

    public LookupRange(): [number,number][][] 
    {
        return [
            [[0,1],[0,2]]
        ]
    }

    public Priority(): number 
    {
        return 1;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.lookupHorizontal || fruit.lookupLshape || fruit.lookupTshape || this.foundFruits.length != 3){
            console.log("=================");
            return false;
        }
        console.log(this.typeFruit , fruit.typeFruit);
        return this.typeFruit === fruit.typeFruit;
    }

    public Points(): number 
    {
        return 5;
    }
    
}

