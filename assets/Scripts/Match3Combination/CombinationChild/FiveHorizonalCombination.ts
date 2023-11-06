import { Fruit } from "../../Match3Component/Fruit";
import { FruitCombination } from "../CombinationBase";

export class FiveHorizonalCombination extends FruitCombination {
    public LookupChange(fruit: Fruit): void 
    {
        fruit.lookupHorizontal = true;
    }

    public LookupRange(): [number,number][][] 
    {
        return [
            [[1,0],[2,0],[3,0],[4,0]],
        ];
    }

    public Priority(): number 
    {
        return 4;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.lookupLshape || fruit.lookupVertical || fruit.lookupTshape || this.foundFruits.length != 5){
            console.log("=================");
            
            return false;
        }
        console.log(this.typeFruit , fruit.typeFruit);
        return this.typeFruit === fruit.typeFruit;
    }

    public Points(): number 
    {
        return 20;
    }
    
}

