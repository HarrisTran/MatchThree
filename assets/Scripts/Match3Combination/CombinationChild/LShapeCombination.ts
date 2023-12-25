import { Fruit } from "../../Match3Component/Fruit";
import { FruitCombination, TypeCombination } from "../CombinationBase";

export class LShapeCombination extends FruitCombination {
    public nameOfCombination: TypeCombination = TypeCombination.LSHAPE;

    public LookupRange(): [number,number][][] 
    {
        return [
            [[0, 0],[0, 1],[0, 2],
             [1, 0],
             [2, 0]],

            [[0,2],[0, 1], [0, 0],
                           [1, 2],
                           [2, 2]],

            [[0, 0],
             [1, 0],
             [2, 0],[2, 1], [2, 2],],

            [              [0, 0],
                           [-1, 0],
            [0, -2],[0, -1],[-2, 0]]
        ]
    }

    public CombinationSize(): number {
        return 5;
    }



    public Test(fruit: Fruit): boolean 
    {
        if(fruit.CanDestroy || this.foundFruits.length != 5){
            return false;
        }
        return this.typeFruit === fruit.typeFruit;
    }

}

