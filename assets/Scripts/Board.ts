import { _decorator, Component, find, instantiate, Label, Layout, log, Node, Prefab, Size, Vec3 } from 'cc';
import { Fruit, MoveDirection, TypeFruit } from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
import { convertTo1DArray, convertTo2DArray, delay, DistinctList, randomInRange } from './Util';
import { MainGameManager } from './MainGameManager';
import { InterfaceMatchMachine, MatchMachine } from './MatchMachine';
import { NormalFruit } from './Match3Component/NormalFruit';
import { SpecialFruit } from './Match3Component/SpecialFruit';
import { CombinationResult, FruitCombination, TypeCombination } from './Match3Combination/CombinationBase';
import { LogoFruit } from './Match3Component/LogoFruit';
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

    private matcher: MatchMachine = null;

    private firstChoosed: Fruit = null;
    private secondChoosed: Fruit = null;

    public AllFruit: Fruit[][] = [];
    public GridCoodinator: Vec3[][] = [];
    

    protected onLoad(): void {
        this.matcher = find("Canvas/TileLayout").getComponent(MatchMachine);
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
        this.gridLayout.getComponent(Layout).updateLayout();
        this.GridCoodinator = convertTo2DArray<Vec3>([...this.gridLayout.children].map(child => child.getPosition()), this.sizeBoard.x, this.sizeBoard.y);
    }

    private initializeTile() {
        let total = this.sizeBoard.x * this.sizeBoard.y;
        this.AllFruit = convertTo2DArray<Fruit>(new Array(total).fill(null), this.sizeBoard.x, this.sizeBoard.y);
        for (let i = 0; i < this.gridLayout.children.length; i++) {
            let x: number = (i / this.sizeBoard.x) | 0;
            let y: number = i % this.sizeBoard.y;
            if(Math.random()<0.15){
                this.spawnLogoFruit(x,y,this.gridLayout.children[i].getPosition());
            }else{
                this.spawnNormalFruit(x, y, this.gridLayout.children[i].getPosition());
            }
            
            if (this.checkMatchAt(x, y, this.AllFruit[x][y])) {
                this.AllFruit[x][y].node.destroy();
                i--;
            }
        }
    }

    private spawnLogoFruit(x: number, y: number,localPos: Vec3){
        let o: Node = instantiate(MainGameManager.instance.LogoPrefab);

        o.setPosition(new Vec3(localPos.x, localPos.y + 250, 0));
        o.parent = this.tileLayout;

        this.AllFruit[x][y] = o.getComponent(LogoFruit);
        this.AllFruit[x][y].position2D = new Grid2D(x, y);
    }

    private spawnNormalFruit(x: number, y: number, localPos: Vec3) {
        const lst = MainGameManager.instance.getNormalFruitListPrefab();
        let o: Node = null;
        o = instantiate(randomInRange(lst));

        o.setPosition(new Vec3(localPos.x, localPos.y + 250, 0));
        o.parent = this.tileLayout;

        this.AllFruit[x][y] = o.getComponent(NormalFruit);
        this.AllFruit[x][y].position2D = new Grid2D(x, y);
    }

    // private spawnSpecicalFruit(x: number, y: number, localPos: Vec3, specialType: TypeFruit) {
    //     const localPosWithOffset = new Vec3(localPos.x, localPos.y + 250, 0);
    //     let o: Node = null;
    //     if (specialType === TypeFruit.BOMB_HORIZONAL) {
    //         o = instantiate(MainGameManager.instance.horizonalRocket);
    //     }
    //     else if (specialType === TypeFruit.BOMB_VERTICAL) {
    //         o = instantiate(MainGameManager.instance.verticalRocket);
    //     }
    //     else if (specialType === TypeFruit.RAINBOW) {
    //         o = instantiate(MainGameManager.instance.rainbowBomb);
    //     }
    //     else if (specialType === TypeFruit.BOMB_SQUARE) {
    //         o = instantiate(MainGameManager.instance.areaBomb);
    //     }
    //     o.setPosition(localPosWithOffset);
    //     o.parent = this.tileLayout;

    //     this.AllFruit[x][y] = o.getComponent(SpecialFruit);
    //     this.AllFruit[x][y].position2D = new Grid2D(x, y);
    // }

    private AddRainbowBomb(a : Grid2D)
    {
        let realPosition = this.GridCoodinator[a.x][a.y];
        let generatePosition = new Vec3(realPosition.x, realPosition.y + 250, 0);
        let f : Node = instantiate(MainGameManager.instance.rainbowBomb);
        f.setPosition(generatePosition);
        f.parent = this.tileLayout;

        this.AllFruit[a.x][a.y] = f.getComponent(SpecialFruit);
        this.AllFruit[a.x][a.y].position2D = a.clone();

    }

    private AddFourHorizonalBomb(a: Grid2D)
    {
        let realPosition = this.GridCoodinator[a.x][a.y];
        let generatePosition = new Vec3(realPosition.x, realPosition.y + 250, 0);
        let f : Node = instantiate(MainGameManager.instance.horizonalRocket);
        f.setPosition(generatePosition);
        f.parent = this.tileLayout;

        this.AllFruit[a.x][a.y] = f.getComponent(SpecialFruit);
        this.AllFruit[a.x][a.y].position2D = a.clone();

    }

    private AddFourVerticalBomb(a: Grid2D)
    {
        let realPosition = this.GridCoodinator[a.x][a.y];
        let generatePosition = new Vec3(realPosition.x, realPosition.y + 250, 0);
        let f : Node = instantiate(MainGameManager.instance.verticalRocket);
        f.setPosition(generatePosition);
        f.parent = this.tileLayout;

        this.AllFruit[a.x][a.y] = f.getComponent(SpecialFruit);
        this.AllFruit[a.x][a.y].position2D = a.clone();

    }

    private AddSquareBomb(a : Grid2D)
    {
        let realPosition = this.GridCoodinator[a.x][a.y];
        let generatePosition = new Vec3(realPosition.x, realPosition.y + 250, 0);
        let f : Node = instantiate(MainGameManager.instance.squareBomb);
        f.setPosition(generatePosition);
        f.parent = this.tileLayout;

        this.AllFruit[a.x][a.y] = f.getComponent(SpecialFruit);
        this.AllFruit[a.x][a.y].position2D = a.clone();

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
        if(f.isLogo) return;

        if (m == MoveDirection.RIGHT && f.position2D.y < 7) {
            otherFruit = this.AllFruit[f.position2D.x][f.position2D.y + 1];
            if(otherFruit.isLogo) return;
            f.swapTo(otherFruit);
        }
        else if (m == MoveDirection.LEFT && f.position2D.y > 0) {
            otherFruit = this.AllFruit[f.position2D.x][f.position2D.y - 1];
            if(otherFruit.isLogo) return;
            f.swapTo(otherFruit);
        }
        else if (m == MoveDirection.DOWN && f.position2D.x < 7) {
            otherFruit = this.AllFruit[f.position2D.x + 1][f.position2D.y];
            if(otherFruit.isLogo) return;
            f.swapTo(otherFruit);
        }
        else if (m == MoveDirection.UP && f.position2D.x > 0) {
            otherFruit = this.AllFruit[f.position2D.x - 1][f.position2D.y];
            if(otherFruit.isLogo) return;
            f.swapTo(otherFruit);
        }

        this.firstChoosed = otherFruit;
        this.secondChoosed = f;
        
        await delay(200);


        if (!this.CheckMove()) {
            f.swapTo(otherFruit);
        }
    }

    private CheckMove(): boolean {
        let isCanMove: boolean = false;
        let combinationList = this.matcher.FindFruitCombinations(convertTo1DArray(this.AllFruit));
        
        if(this.secondChoosed.isNormal() && this.firstChoosed.isNormal()){
            if (combinationList?.length > 0) {
                this.DestroyAllCombination(combinationList);
                isCanMove = true;
            } else {
                isCanMove = false;
            }
        }else{
            this.RemoveForSpecialFruit();
            isCanMove = true;
        }

        return isCanMove;
    }

    public FindRange(fruit: Fruit, lookup: FruitCombination) : Fruit[]{
         
        for(let pattern of lookup.LookupRange()){
            let result = [];
            for(let offset of pattern){
                let newRow : number = fruit.position2D.x + offset[0];
                let newColumn : number = fruit.position2D.y + offset[1];
                
                if(this.IsPositionOnBoard(new Grid2D(newRow, newColumn)) && fruit.compareTo(this.AllFruit[newRow][newColumn])){
                    result.push(this.AllFruit[newRow][newColumn]);
                    
                    if (result.length === lookup.CombinationSize()) {
                        return result;
                    }
                }else{
                    break;
                }
            }
        }
         
        
        return [];
    }

    

    private async RemoveForSpecialFruit(){
        for(let f of [this.firstChoosed,this.secondChoosed]){
            this.PerformSpecialFruit(f);
        }
        await delay(100);

        this.DropColumn();
    }

    private PerformSpecialFruit(f: Fruit){
        if(f.typeFruit == TypeFruit.BOMB_HORIZONAL){
            this.getRow(f).forEach(o=>{
                o.inCombination = true;
                this.DestroyMatchedFruitAt(o.position2D.x,o.position2D.y);
            })
        }
        if(f.typeFruit == TypeFruit.BOMB_VERTICAL){
            this.getColumn(f).forEach(o=>{
                o.inCombination = true;
                this.DestroyMatchedFruitAt(o.position2D.x,o.position2D.y);
            })
        }
        if(f.typeFruit == TypeFruit.RAINBOW){
            let box : Fruit[] = [];

            if(this.firstChoosed.typeFruit == TypeFruit.RAINBOW && this.secondChoosed.typeFruit != TypeFruit.RAINBOW){
                box = this.getColor(this.secondChoosed);
                box.push(this.firstChoosed);
            }
            if(this.firstChoosed.typeFruit != TypeFruit.RAINBOW && this.secondChoosed.typeFruit == TypeFruit.RAINBOW){
                box = this.getColor(this.firstChoosed);
                box.push(this.secondChoosed);
            }

            box.forEach(e => {
                e.inCombination = true;
                this.DestroyMatchedFruitAt(e.position2D.x,e.position2D.y);
            })

        }
        if(f.typeFruit == TypeFruit.BOMB_SQUARE){
            this.getArea(f).forEach(o=>{
                o.inCombination = true;
                this.DestroyMatchedFruitAt(o.position2D.x,o.position2D.y);
            })
        }
    }

    private async DestroyAllCombination(fruitsCombination: CombinationResult[]) { // 0
        if(fruitsCombination.length == 0) return;

        for (let i = 0; i < 8; i++) {
            if(this.AllFruit[7][i].typeFruit == TypeFruit.LOGO){
                this.AllFruit[7][i].inCombination = true;
                this.DestroyMatchedFruitAt(7,i);
            }
        }

        for (let combi of fruitsCombination) {
            for(let f of combi.foundFruits){
                this.DestroyMatchedFruitAt(f.position2D.x,f.position2D.y);
            }
        }

        this.GenerateSpecialCombos(fruitsCombination); // 1

        await delay(200);

        this.DropColumn();
    }

    private GenerateSpecialCombos(fruitsCombination : CombinationResult[]) {
        
        for(let c of fruitsCombination){
            switch (c.typeCombination.NAME) {
                case TypeCombination.FIVE_HORIZONAL:
                case TypeCombination.FIVE_VERTICAL:
                    this.AddRainbowBomb(c.typeCombination.foundFruits[0].position2D);
                    break;
                case TypeCombination.FOUR_HORIZONAL:
                    this.AddFourHorizonalBomb(c.typeCombination.foundFruits[0].position2D);
                    break;
                case TypeCombination.FOUR_VERTICAL:
                    this.AddFourVerticalBomb(c.typeCombination.foundFruits[0].position2D);
                    break;
                case TypeCombination.LSHAPE:
                case TypeCombination.TSHAPE:
                    this.AddSquareBomb(c.typeCombination.foundFruits[0].position2D);
                    break;
                default:
                    break;
            }
        }
    }

    private DestroyMatchedFruitAt(x: number, y: number) {
        let fruit = this.AllFruit[x][y];
        
        if (fruit?.inCombination) {
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

        await delay(200);

        let combinationList = this.matcher.FindFruitCombinations(convertTo1DArray(this.AllFruit));
        this.DestroyAllCombination(combinationList);
    }

    public IsPositionOnBoard(lookupPosition: Grid2D): boolean {
        return (0 <= lookupPosition.x && lookupPosition.x < this.sizeBoard.x) && (0 <= lookupPosition.y && lookupPosition.y < this.sizeBoard.y);
    }

    public getRow(f: Fruit) {
        return this.AllFruit[f.position2D.x];
    }

    public getColumn(f: Fruit) {
        return this.AllFruit.map(row => row[f.position2D.y]);
    }

    public getColor(f: Fruit){
        let fruits : Array<Fruit> = new Array();
        for(let i = 0;i < this.AllFruit.length; i++){
            for (let j = 0; j < this.AllFruit[0].length; j++) {
                if(this.AllFruit[i][j].typeFruit === f.typeFruit){
                    fruits.push(this.AllFruit[i][j]);
                }
            }
        }
        return fruits;
    }

    public getArea(f: Fruit){
        let fruits : Array<Fruit> = new Array();
        for(let i = f.position2D.x - 1; i < f.position2D.x + 2; i++){
            for (let j = f.position2D.y - 1; j < f.position2D.y + 2; j++) {
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


