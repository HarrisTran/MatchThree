import { _decorator, Component, find, instantiate, Label, Layout, Node, Prefab, Size, Vec3 } from 'cc';
import { Fruit, MoveDirection, TypeFruit } from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
import { convertTo1DArray, convertTo2DArray, delay, DistinctList, randomInRange } from './Util';
import { MainGameManager } from './MainGameManager';
import { InterfaceMatchMachine } from './MatchMachine';
import { NormalFruit } from './Match3Component/NormalFruit';
import { SpecialFruit } from './Match3Component/SpecialFruit';
import { FruitCombination } from './Match3Combination/CombinationBase';
import { FiveHorizonalCombination } from './Match3Combination/CombinationChild/FiveHorizonalCombination';
import { FiveVerticalCombination } from './Match3Combination/CombinationChild/FiveVerticalCombination';
import { FourHorizonalCombination } from './Match3Combination/CombinationChild/FourHorizonalCombination';
import { FourVerticalCombination } from './Match3Combination/CombinationChild/FourVerticalCombination';
import { ThreeHorizonalCombination } from './Match3Combination/CombinationChild/ThreeHorizonalCombination';
import { ThreeVerticalCombination } from './Match3Combination/CombinationChild/ThreeVerticalCombination';
import { TShapeCombination } from './Match3Combination/CombinationChild/TShapeCombination';
import { LShapeCombination } from './Match3Combination/CombinationChild/LShapeCombination';
const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    @property(Size)
    private sizeBoard: Size = null;

    @property(Node)
    private gridLayout: Node = null;

    @property(Node)
    private tileLayout: Node = null;

    @property(Prefab)
    private tileBg: Prefab = null;

    @property(Label)
    private scoreText: Label = null;

    private matcher: InterfaceMatchMachine = null;

    private firstChoosed: Fruit = null;
    private secondChoosed: Fruit = null;

    public AllFruit: Fruit[][] = [];
    public GridCoodinator: Vec3[][] = [];
    

    protected onLoad(): void {
        this.matcher = find("Canvas/TileLayout").getComponent("MatchMachine") as InterfaceMatchMachine;
        this.initializeGridUI();
        this.initializeTile();
    }

    

    private initializeGridUI() {
        for (let i = 0; i < this.sizeBoard.x; i++) {
            for (let j = 0; j < this.sizeBoard.y; j++) {
                let o: Node = instantiate(this.tileBg);
                o.parent = this.gridLayout;
                o.name = `Tile ${i},${j}`;
            }
        }
        this.setScore();
        this.gridLayout.getComponent(Layout).updateLayout();
        this.GridCoodinator = convertTo2DArray<Vec3>([...this.gridLayout.children].map(child => child.getPosition()), this.sizeBoard.x, this.sizeBoard.y);
    }

    private initializeTile() {
        const total = this.sizeBoard.x * this.sizeBoard.y;
        this.AllFruit = convertTo2DArray<Fruit>(new Array(total).fill(null), this.sizeBoard.x, this.sizeBoard.y);
        for (let i = 0; i < this.gridLayout.children.length; i++) {
            const x: number = (i / this.sizeBoard.x) | 0;
            const y: number = i % this.sizeBoard.y;
            this.spawnNormalFruit(x, y, this.gridLayout.children[i].getPosition());
            if (this.checkMatchAt(x, y, this.AllFruit[x][y])) {
                this.AllFruit[x][y].node.destroy();
                i--;
            }
        }
    }

    private spawnNormalFruit(x: number, y: number, localPos: Vec3) {
        const lst = MainGameManager.instance.getNormalFruitListPrefab();
        const localPosWithOffset = new Vec3(localPos.x, localPos.y + 200, 0);
        let o: Node = instantiate(randomInRange(lst));
        o.setPosition(localPosWithOffset);
        o.parent = this.tileLayout;

        this.AllFruit[x][y] = o.getComponent(NormalFruit);
        this.AllFruit[x][y].position2D = new Grid2D(x, y);
    }

    private spawnSpecicalFruit(x: number, y: number, localPos: Vec3, specialType: TypeFruit) {
        const localPosWithOffset = new Vec3(localPos.x, localPos.y + 200, 0);
        let o: Node = null;
        if (specialType === TypeFruit.BOMB_HORIZONAL) {
            o = instantiate(MainGameManager.instance.horizonalRocket);
        }
        else if (specialType === TypeFruit.BOMB_VERTICAL) {
            o = instantiate(MainGameManager.instance.verticalRocket);
        }
        else if (specialType === TypeFruit.RAINBOW) {
            o = instantiate(MainGameManager.instance.rainbowBomb);
        }
        else if (specialType === TypeFruit.BOMB_SQUARE) {
            o = instantiate(MainGameManager.instance.areaBomb);
        }
        o.setPosition(localPosWithOffset);
        o.parent = this.tileLayout;

        this.AllFruit[x][y] = o.getComponent(SpecialFruit);
        this.AllFruit[x][y].position2D = new Grid2D(x, y);
    }

    private checkMatchAt(x: number, y: number, fruit: Fruit) {
        if (x >= 2) {
            if (fruit.compareTo(this.AllFruit[x - 1][y]) && fruit.compareTo(this.AllFruit[x - 2][y])) {
                return true;
            }
        }

        if (y >= 2) {
            if (fruit.compareTo(this.AllFruit[x][y - 1]) && fruit.compareTo(this.AllFruit[x][y - 2])) {
                return true;
            }
        }

        return false;
    }

    public async swapTo(f: Fruit, m: MoveDirection) {
        let otherFruit: Fruit = null;

        if (m == MoveDirection.RIGHT && f.position2D.y < 7) {
            otherFruit = this.AllFruit[f.position2D.x][f.position2D.y + 1];
            f.swapTo(otherFruit);
        }
        else if (m == MoveDirection.LEFT && f.position2D.y > 0) {
            otherFruit = this.AllFruit[f.position2D.x][f.position2D.y - 1];
            f.swapTo(otherFruit);
        }
        else if (m == MoveDirection.DOWN && f.position2D.x < 7) {
            otherFruit = this.AllFruit[f.position2D.x + 1][f.position2D.y];
            f.swapTo(otherFruit);
        }
        else if (m == MoveDirection.UP && f.position2D.x > 0) {
            otherFruit = this.AllFruit[f.position2D.x - 1][f.position2D.y];
            f.swapTo(otherFruit);
        }

        this.firstChoosed = otherFruit;
        this.secondChoosed = f;

        await delay(200);

        if (!this.CheckMove()) {
            f.swapTo(otherFruit);
        }
    }

    public FindRange(fruit: Fruit, lookup: [number,number][][]) : Fruit[]{
        let result : Fruit[] = [];    
            
        for(let pattern of lookup){
            let result : Fruit[] = [fruit];
            for(let offset of pattern){
                let newRow = fruit.position2D.x + offset[1];
                let newColumn = fruit.position2D.y + offset[0];
                if(this.IsPositionOnBoard(new Grid2D(newRow, newColumn)) && result[0].compareTo(this.AllFruit[newRow][newColumn])){
                    result.push(this.AllFruit[newRow][newColumn]);
                }else{
                    break;
                }
            }

            if(result.length === pattern.length){
                return result;
            }
        }
        
        return result;
    }


    private CheckMove(): boolean {
        let isCanMove: boolean = false;
        //let lstMatch = this.matcher.ListAllMatch.getList();
        let lstMatch = this.matcher.FindFruitCombinations(convertTo1DArray(this.AllFruit));
        

        if(this.secondChoosed.isNormal() && this.firstChoosed.isNormal()){
            if (lstMatch?.length > 0) {
                console.log("+++++++++++++",lstMatch);
                
                //this.DestroyAllMatches(lstMatch);
                isCanMove = true;
                //return true;
            } else {
                console.log("-------------",[]);
                isCanMove = false;
            }
        }else{
            this.RemoveForSpecialFruit();
            isCanMove = true;
        }

        return isCanMove;
    }

    private RemoveForSpecialFruit(){
        for(let f of [this.firstChoosed,this.secondChoosed]){
            this.PerformSpecialFruit(f);
        }
    }

    private PerformSpecialFruit(f: Fruit){
        if(f.typeFruit == TypeFruit.BOMB_HORIZONAL){
            this.DestroyAllMatches(this.matcher.MarkAllRow(f.position2D.x));
        }
        if(f.typeFruit == TypeFruit.BOMB_VERTICAL){
            this.DestroyAllMatches(this.matcher.MarkAllColumn(f.position2D.y));
        }
        if(f.typeFruit == TypeFruit.RAINBOW){
            this.DestroyAllMatches(this.matcher.MarkAllSameType(this.firstChoosed,this.secondChoosed));
        }
    }

    private async DestroyAllMatches(fruits: Fruit[]) {

        for (let o of fruits) {
            this.DestroyMatchedFruitAt(o.position2D.x, o.position2D.y);
        }

        this.GenerateSpecialCombos();

        await delay(200);

        this.DropColumn();
    }

    private GenerateSpecialCombos() {
        for (let c of this.matcher.ListAllSpecialPostion.getList()) {

            if (c.typeTile == TypeFruit.BOMB_HORIZONAL) {
                const position = c.tileCluster[0].position2D;
                this.spawnSpecicalFruit(position.x, position.y, this.GridCoodinator[position.x][position.y], TypeFruit.BOMB_HORIZONAL);
            }
            else if (c.typeTile == TypeFruit.BOMB_VERTICAL) {
                const position = c.tileCluster[0].position2D;
                this.spawnSpecicalFruit(position.x, position.y, this.GridCoodinator[position.x][position.y], TypeFruit.BOMB_VERTICAL);
            }
            else if (c.typeTile == TypeFruit.RAINBOW) {
                const position = c.tileCluster[2].position2D;
                this.spawnSpecicalFruit(position.x, position.y, this.GridCoodinator[position.x][position.y], TypeFruit.RAINBOW);
            }
        }
    }

    private DestroyMatchedFruitAt(x: number, y: number) {
        let fruit = this.AllFruit[x][y];
        if (fruit?.isMatched) {
            fruit.node.destroy();
            MainGameManager.instance.Score = fruit.getScoreReward();
            this.setScore();
            this.AllFruit[x][y] = null;
        }
    }

    private async DropColumn() {
        for (let i = 0; i < 8; i++) {
            let counter = 0;
            for (let j = 7; j >= 0; j--) {
                if (this.AllFruit[j][i] == null) {
                    counter++;
                } else {
                    this.AllFruit[j][i].position2D.x += counter;
                    this.AllFruit[j + counter][i] = this.AllFruit[j][i];
                    this.AllFruit[j][i] = null;
                }
            }
        }

        await delay(200);

        this.FullfillColumn();
    }

    private async FullfillColumn() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!this.AllFruit[i][j]) {
                    this.spawnNormalFruit(i, j, this.GridCoodinator[i][j]);
                }
            }
        }

        await delay(400);

        const lstMatch = this.matcher.ListAllMatch.getList();
        if (lstMatch && lstMatch.length > 0) {
            this.DestroyAllMatches(lstMatch);
        }
    }

    public IsPositionOnBoard(lookupPosition: Grid2D): boolean {
        return (0 <= lookupPosition.x && lookupPosition.x < this.sizeBoard.x) && (0 <= lookupPosition.y && lookupPosition.y < this.sizeBoard.y);
    }

    public getRow(i: number) {
        return this.AllFruit[i];
    }

    public getColumn(i: number) {
        return this.AllFruit.map(row => row[i]);
    }

    public getColor(type: TypeFruit){
        let fruits : Array<Fruit> = new Array();
        for(let i = 0;i < this.AllFruit.length; i++){
            for (let j = 0; j < this.AllFruit[0].length; j++) {
                if(this.AllFruit[i][j].typeFruit == type){
                    fruits.push(this.AllFruit[i][j]);
                }
            }
        }
        return fruits;
    }

    public getArea(pos: Grid2D){
        let fruits : Array<Fruit> = new Array();
        for(let i = pos.x - 2; i < pos.x + 2; i++){
            for (let j = pos.y - 2; j < pos.y + 2; j++) {
                if(this.IsPositionOnBoard(new Grid2D(i,j))){
                    fruits.push(this.AllFruit[i][j]);
                }
            }
        }
        return fruits;
    }


    private setScore() {
        this.scoreText.string = MainGameManager.instance.Score.toString();
    }
}


