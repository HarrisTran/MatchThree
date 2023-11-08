import { _decorator, Component, log, Node } from 'cc';
import { Board } from './Board';
import { Fruit, TypeFruit } from './Match3Component/Fruit';
import { CombinationResult, FruitCombination } from './Match3Combination/CombinationBase';
import { FiveHorizonalCombination } from './Match3Combination/CombinationChild/FiveHorizonalCombination';
import { FiveVerticalCombination } from './Match3Combination/CombinationChild/FiveVerticalCombination';
import { FourHorizonalCombination } from './Match3Combination/CombinationChild/FourHorizonalCombination';
import { FourVerticalCombination } from './Match3Combination/CombinationChild/FourVerticalCombination';
import { LShapeCombination } from './Match3Combination/CombinationChild/LShapeCombination';
import { TShapeCombination } from './Match3Combination/CombinationChild/TShapeCombination';
import { ThreeHorizonalCombination } from './Match3Combination/CombinationChild/ThreeHorizonalCombination';
import { ThreeVerticalCombination } from './Match3Combination/CombinationChild/ThreeVerticalCombination';
const { ccclass, property } = _decorator;

@ccclass('MatchMachine')
export class MatchMachine extends Component {
    @property(Board)
    private board: Board;
    public m_baseCombination: FruitCombination[];

    protected start(): void {
        this.m_baseCombination = [
            new FiveHorizonalCombination(), 
            new FiveVerticalCombination(),
            new TShapeCombination(), 
            new LShapeCombination(),
            new FourHorizonalCombination(), 
            new FourVerticalCombination(),
            new ThreeHorizonalCombination(), 
            new ThreeVerticalCombination()
        ];

        this.m_baseCombination.sort((a,b) => b.Priority() - a.Priority());
        
    }

    public FindFruitCombinations(fruits: Fruit[]) {
        for (let fruit of fruits) {
            fruit.CanDestroy = false;
        }

        let list: CombinationResult[] = [];

        for (let combo of this.m_baseCombination) {
            for (let fruit of fruits) {
                if(fruit.isLogo) continue;
                if (this.ValidateCombination(combo, fruit)) {
                    list.push(combo.GetResult());
                }
            }
        }
        // use to test : this.ValidateCombination(this.m_baseCombination[4],this.board.AllFruit[4][2]);
        return list;
    }

    public ValidateCombination(combination: FruitCombination, fruit: Fruit): boolean {
        let test = true;
        
        let fruitResult = this.board.FindRange(fruit, combination);

        if (fruitResult == null || fruitResult.length < 3) return false;

        combination.typeFruit = fruit.typeFruit;
        combination.foundFruits = fruitResult;
        
        for (let fruit of fruitResult) {
            if (!combination.Test(fruit)) {
                test = false;
                break;
            }
        }

        if (test) {
            for (let fruit of fruitResult) {
                combination.LookupChange(fruit);
            }
        }

        return test;
    }
}
