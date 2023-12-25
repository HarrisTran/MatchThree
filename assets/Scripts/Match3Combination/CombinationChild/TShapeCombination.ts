import { Fruit } from "../../Match3Component/Fruit";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class TShapeCombination extends FruitCombination {

    public nameOfCombination: TypeCombination = TypeCombination.TSHAPE;


    public LookupRange(): [number,number][][] 
    {
        return [
            [[0, 0],[0, -1], [0, 1],
                    [1, 0],
                    [2, 0]],

            [[0, 0],
            [-1, 0],[0, 1], [0, 2],
            [1, 0]],

            [                [0, 0],
            [0, -1], [0, -2],[-1, 0],
                             [1, 0]],

            [       [0, 0], 
                    [-1, 0], 
            [0, -1],[-2, 0], [0, 1]]
        ]
    }

    public CombinationSize(): number {
        return 3;
    }


    public Test(fruit: Fruit): boolean 
    {
        if(fruit.CanDestroy || this.foundFruits.length != 5){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }
    
}

