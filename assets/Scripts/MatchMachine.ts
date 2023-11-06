import { _decorator, Component, Node } from 'cc';
import { Board } from './Board';
import { DistinctList } from './Util';
import { Fruit, TypeFruit } from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
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

    private listAllMatch: DistinctList<Fruit> = new DistinctList<Fruit>();
    private listAllSpecialPosition: DistinctList<GroupOfFruit> = new DistinctList<GroupOfFruit>();
    public m_baseCombination : FruitCombination[];

    protected start(): void {
        this.m_baseCombination = [new FiveHorizonalCombination(), new FiveVerticalCombination(),
                                  new FourHorizonalCombination(), new FourVerticalCombination(),
                                  new ThreeHorizonalCombination(), new ThreeVerticalCombination(),
                                  new TShapeCombination(), new LShapeCombination()];
    }

    public FindFruitCombinations(fruits: Fruit[]){
        for(let fruit of fruits){
            fruit.resetLookup();
        }

        let list : CombinationResult[] = [];

        for(let combo of this.m_baseCombination){
            for(let fruit of fruits){
                if(this.ValidateCombination(combo,fruit)){
                    
                    list.push(combo.GetResult());
                }
            }
        }
        // use to test : this.ValidateCombination(this.m_baseCombination[4],this.board.AllFruit[4][2]);

        return list;
    }

    public ValidateCombination(combination: FruitCombination, fruit: Fruit): boolean{
        let test = true;

        let fruitResult = this.board.FindRange(fruit,combination.LookupRange());
        
        for(let fruit of fruitResult){
            console.log(fruit.position2D);
            
        }

        if(fruitResult == null) return false;
        if(fruitResult.length < 3) return false;

        combination.typeFruit = fruit.typeFruit;
        combination.foundFruits = fruitResult;


        // for(let fruit of fruitResult){
        //     if(!combination.Test(fruit)){
        //         test = false;
        //         break;
        //     }
        // }
        console.log(fruitResult);
        


        

        if(test){
            
            for(let fruit of fruitResult){
                combination.LookupChange(fruit);
            }
        }
        
        
        return test;
    }

    public get ListAllMatch() {
        this.listAllMatch.clear();
        this.listAllSpecialPosition.clear();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.CheckMatches(this.board.AllFruit[i][j], i, j);
            }
        }
        return this.listAllMatch;
    }

    public get ListAllSpecialPostion() {
        return this.listAllSpecialPosition;
    }

    private CheckMatches(fruit: Fruit, startRow: number, startColumn: number) {
        if(!fruit || this.listAllSpecialPosition.size() > 0) return;

        let matchCount = 1;
        let matchedPositions: Fruit[] = [fruit];

        let rowCount = 0;
        let columnCount = 0;

        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow + i;
            const currentCol = startColumn ;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                //matchCount++;
                columnCount++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
            } else {
                break;
            }
        }

        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow - i;
            const currentCol = startColumn ;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                //matchCount++;
                columnCount++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
            } else {
                break;
            }
        }

        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow;
            const currentCol = startColumn + i;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                // matchCount++;
                rowCount++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
            } else {
                break;
            }
        }

        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow ;
            const currentCol = startColumn - i;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                // matchCount++;
                rowCount++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
            } else {
                break;
            }
        }

        if (rowCount + columnCount >= 2) {
            for (let i of matchedPositions) {
                this.board.AllFruit[i.position2D.x][i.position2D.y].isMatched = true;
                this.listAllMatch.add(this.board.AllFruit[i.position2D.x][i.position2D.y]);
            }
        }

        if(rowCount + columnCount >= 3) this.MarkAndAddSpecialFruit(matchedPositions,rowCount,columnCount);
    }

    public MarkAndAddSpecialFruit(matchedPositions : Fruit[], rowCount: number, columnCount: number){
        
        
        if (rowCount == 4 || columnCount == 4) {
            this.listAllSpecialPosition.add(new GroupOfFruit(TypeFruit.RAINBOW, matchedPositions));
        }
        else if(rowCount >= 2 || columnCount >= 2){
            console.log("--------------------------------------------------------------");
        }else if(rowCount == 3 && columnCount <= 1){
            this.listAllSpecialPosition.add(new GroupOfFruit(TypeFruit.BOMB_HORIZONAL, matchedPositions));
        }else if(columnCount == 3 && rowCount <= 1){
            this.listAllSpecialPosition.add(new GroupOfFruit(TypeFruit.BOMB_VERTICAL, matchedPositions));
        }else{
            for (let i of matchedPositions) {
                this.board.AllFruit[i.position2D.x][i.position2D.y].isMatched = true;
                this.listAllMatch.add(this.board.AllFruit[i.position2D.x][i.position2D.y]);
            }
        }

    }

    public MarkAllRow(row: number) {
        let fruits: Array<Fruit> = new Array();
        for (let x of this.board.getRow(row)) {
            fruits.push(x);
            x.isMatched = true;
        }
        return fruits;
    }

    public MarkAllColumn(column: number) {
        let fruits: Array<Fruit> = new Array();
        for (let x of this.board.getColumn(column)) {
            fruits.push(x);
            x.isMatched = true;
        }
        return fruits;
    }

    public MarkAllArea(fruit: Fruit) {
        let fruits: Array<Fruit> = new Array();
        for (let x of this.board.getArea(fruit.position2D)) {
            fruits.push(x);
            x.isMatched = true;
        }
        return fruits;
    }

    public MarkAllSameType(fruit1: Fruit, fruit2: Fruit) {
        let fruits: Array<Fruit> = new Array();

        for (let i of [fruit1, fruit2]) {
            if (i.typeFruit == TypeFruit.RAINBOW) {
                fruits.push(i);
                i.isMatched = true;
            } else {
                for (let x of this.board.getColor(i.typeFruit)) {
                    fruits.push(x);
                    x.isMatched = true;
                }
            }
        }
        return fruits;
    }
}

export interface InterfaceMatchMachine extends MatchMachine { }

export class GroupOfFruit {
    typeTile: TypeFruit;
    tileCluster: Fruit[];
    constructor(typeTile: TypeFruit, tiles: Fruit[]) {
        this.typeTile = typeTile;
        this.tileCluster = tiles;
    }
}

