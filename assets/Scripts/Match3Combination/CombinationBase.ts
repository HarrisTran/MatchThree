import { TypeFruit } from "../MainGameManager";
import { Fruit} from "../Match3Component/Fruit";

export enum TypeCombination  {
    FIVE_HORIZONAL = "Five_Horizonal",
    FIVE_VERTICAL = "Five_Vertical",
    FOUR_HORIZONAL = "Four_Horizonal",
    FOUR_VERTICAL = "Four_Vertical",
    LSHAPE = "LShape",
    THREE_HORIZONAL = "Three_Horizonal",
    THREE_VERTICAL = "Three_Vertical",
    TSHAPE = "TShape"
}
export abstract class FruitCombination {
    public foundFruits: Fruit[] = new Array<Fruit>();
    public nameOfCombination : TypeCombination;
    public typeFruit: TypeFruit;

    public abstract LookupRange(): [number, number][][];
    public abstract Test(fruit: Fruit): boolean;
    public abstract CombinationSize() : number;
    
    public GetResult(){
        return this.foundFruits;
    }

    // public LookupChange(fruit: Fruit) {
    //     fruit.CanDestroy = true;
    // }
}