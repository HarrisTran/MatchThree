import { Fruit } from "../../Match3Component/Fruit";
import { FruitCombination } from "../CombinationBase";
import { Grid2D } from "../../Match3Component/Grid2D";

export class TShapeCombination extends FruitCombination {
    public LookupChange(fruit: Fruit): void 
    {
        fruit.lookupTshape = true;
    }

    public LookupRange(): [number,number][][] 
    {
        return [
            [[0, 1], [0, -1], [1, 0], [2, 0]],
            [[-1, 0], [1, 0], [0, -1], [0, -2]],
            [[0, 1], [0, -1], [-1, 0], [-2, 0]],
            [[0, 2], [0, 1], [1, 0], [-1, 0]]
        ]
    }

    public Priority(): number 
    {
        return 3;
    }

    public Test(fruit: Fruit): boolean 
    {
        if(fruit.lookupHorizontal || fruit.lookupLshape || fruit.lookupVertical || this.foundFruits.length != 5){
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

