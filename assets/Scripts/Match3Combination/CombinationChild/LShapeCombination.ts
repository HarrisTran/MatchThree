import { Fruit } from "../../Match3Component/Fruit";
import { FruitCombination } from "../CombinationBase";

export class LShapeCombination extends FruitCombination {
    public LookupChange(fruit: Fruit): void 
    {
        fruit.lookupLshape = true;
    }

    public LookupRange(): [number,number][][] 
    {
        return [
            [[0, 1], [0, 2], [1, 0], [2, 0]],
            [[1, 0], [2, 0], [2, 1], [2, 2]],
            [[0, 1], [0, 2], [1, 2], [2, 2]],
            [[0, -1], [0, -2], [-1, 0], [-2, 0]]
        ]
    }

    public Priority(): number 
    {
        return 3;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.lookupVertical || fruit.lookupHorizontal || fruit.lookupTshape || this.foundFruits.length != 5){
            console.log("=================");
            return false;
        }
        console.log(this.typeFruit , fruit.typeFruit);
        return this.typeFruit === fruit.typeFruit;
    }

    public Points(): number 
    {
        return 15;
    }
    
}

