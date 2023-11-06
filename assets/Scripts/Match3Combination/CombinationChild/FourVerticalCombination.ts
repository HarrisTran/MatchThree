import { Fruit } from "../../Match3Component/Fruit";
import { FruitCombination } from "../CombinationBase";

export class FourVerticalCombination extends FruitCombination {
    public LookupChange(fruit: Fruit): void 
    {
        fruit.lookupVertical = true;
    }

    public LookupRange(): [number,number][][] 
    {
        return [
            [[0,1],[0,2],[0,3]],
        ]
    }

    public Priority(): number {
        return 2;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.lookupLshape || fruit.lookupHorizontal || fruit.lookupTshape || this.foundFruits.length != 4){
            console.log("=================");
            return false;
        }
        console.log(this.typeFruit , fruit.typeFruit);
        return this.typeFruit === fruit.typeFruit;
    }
    public Points(): number {
        return 15;
    }
    
}

