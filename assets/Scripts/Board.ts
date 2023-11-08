import { _decorator, Component, find, instantiate, Label, Layout, log, Node, Prefab, Size, Vec3 } from 'cc';
import { Fruit, MoveDirection, TypeFruit } from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
import { convertTo1DArray, convertTo2DArray, delay, randomInRange } from './Util';
import { MainGameManager } from './MainGameManager';
import { MatchMachine } from './MatchMachine';
import { CombinationResult, FruitCombination, TypeCombination } from './Match3Combination/CombinationBase';
const { ccclass, property } = _decorator;

const arrayLogo = [new Grid2D(0, 0), new Grid2D(1, 1), new Grid2D(2, 2), new Grid2D(3, 3),
new Grid2D(4, 4), new Grid2D(3, 5), new Grid2D(2, 6), new Grid2D(1, 7)];

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

    private isPlaying: boolean = false;


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
            arrayLogo.findIndex(a => a.compareTo(new Grid2D(x,y))) == -1 ? this.spawnNormalFruit(x, y) : this.spawnLogoFruit(x, y);
            if (this.checkMatchAt(x, y, this.AllFruit[x][y])) {
                this.AllFruit[x][y].node.destroy();
                i--;
            }
        }
    }

    private AddRainbowBomb(x: number, y: number) {
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0), MainGameManager.instance.rainbowBomb, "SpecialFruit");
    }

    private AddFourHorizonalBomb(x: number, y: number) {
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0), MainGameManager.instance.horizonalRocket, "SpecialFruit");
    }

    private AddFourVerticalBomb(x: number, y: number) {
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0), MainGameManager.instance.verticalRocket, "SpecialFruit");
    }

    private AddSquareBomb(x: number, y: number) {
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0), MainGameManager.instance.squareBomb, "SpecialFruit");
    }

    private spawnLogoFruit(x: number, y: number) {
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0), MainGameManager.instance.LogoPrefab, "LogoFruit");
    }

    private spawnNormalFruit(x: number, y: number) {
        const lst = MainGameManager.instance.getNormalFruitListPrefab();
        this.spawnNewFruit(x, y, new Vec3(0, 250, 0), randomInRange(lst), "NormalFruit");
    }

    private spawnNewFruit(x: number, y: number, offset: Vec3, prefab: Prefab, comp: string) {
        let newNode: Node = instantiate(prefab);

        newNode.setPosition(this.GridCoodinator[x][y].clone().add(offset));
        newNode.parent = this.tileLayout;

        this.AllFruit[x][y] = newNode.getComponent(comp) as Fruit;
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
        if(this.isPlaying) return;
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

        await delay(300);

        if (!this.CheckMove()) {
            f.swapTo(otherFruit);
        }
    }

    private CheckMove(): boolean {
        let isCanMove: boolean = false;
        let combinationList = this.matcher.FindFruitCombinations(convertTo1DArray(this.AllFruit));

        if (combinationList?.length > 0) {
            if ((this.firstChoosed.isNormal() || this.firstChoosed.isLogo) && (this.secondChoosed.isNormal() || this.secondChoosed.isLogo)) {
            }
            else {
                this.MarkGroupSpecialFruit();
            }
            isCanMove = true;
        }
        else {
            if ((this.firstChoosed.isNormal() || this.firstChoosed.isLogo) && (this.secondChoosed.isNormal() || this.secondChoosed.isLogo)) {
                isCanMove = false;
            } else {
                this.MarkGroupSpecialFruit();
                isCanMove = true;
            }
        }

        this.DestroyAllCombination(combinationList);


        return isCanMove;
    }

    public FindRange(fruit: Fruit, lookup: FruitCombination): Fruit[] {
        for (let pattern of lookup.LookupRange()) {
            let result = [];
            for (let offset of pattern) {
                let newRow: number = fruit.position2D.x + offset[0];
                let newColumn: number = fruit.position2D.y + offset[1];

                if (this.IsPositionOnBoard(new Grid2D(newRow, newColumn)) && fruit.compareTo(this.AllFruit[newRow][newColumn])) {
                    result.push(this.AllFruit[newRow][newColumn]);

                    if (result.length === lookup.CombinationSize()) {
                        return result;
                    }
                } else {
                    break;
                }
            }
        }
        return [];
    }

    private async MarkGroupSpecialFruit() {
        for (let f of [this.firstChoosed, this.secondChoosed]) {
            if (f.typeFruit == TypeFruit.BOMB_HORIZONAL) {
                this.getRow(f).forEach(o => {
                    o.CanDestroy = true;
                })
            }
            if (f.typeFruit == TypeFruit.BOMB_VERTICAL) {
                this.getColumn(f).forEach(o => {
                    o.CanDestroy = true;
                })
            }
            if (f.typeFruit == TypeFruit.RAINBOW) {
                let box: Fruit[] = [];

                if (this.firstChoosed.typeFruit == TypeFruit.RAINBOW && this.secondChoosed.typeFruit != TypeFruit.RAINBOW) {
                    box = this.getColor(this.secondChoosed);
                    box.push(this.firstChoosed);
                }
                if (this.firstChoosed.typeFruit != TypeFruit.RAINBOW && this.secondChoosed.typeFruit == TypeFruit.RAINBOW) {
                    box = this.getColor(this.firstChoosed);
                    box.push(this.secondChoosed);
                }

                box.forEach(e => {
                    e.CanDestroy = true;
                })

            }
            if (f.typeFruit == TypeFruit.BOMB_SQUARE) {
                this.getArea(f).forEach(o => {
                    o.CanDestroy = true;
                })
            }
        }
    }


    private async DestroyAllCombination(fruitsCombination: CombinationResult[]) { // 0
        this.isPlaying = true;
        let hellStorage: Fruit[] = [];

        for (let i = 0; i < this.AllFruit.length; i++) {
            if (this.AllFruit[7][i].isLogo) {
                this.AllFruit[7][i].forceDestroy();
            }
        }

        for (let i = 0; i < this.AllFruit.length; i++) {
            for (let j = 0; j < this.AllFruit[0].length; j++) {
                if (this.AllFruit[i][j].CanDestroy) {
                    hellStorage.push(this.AllFruit[i][j]);
                }
            }
        }

        if (hellStorage.length <= 0) {
            this.isPlaying = false;
            return;
        }

        hellStorage.forEach(i => this.DestroyMatchedFruitAt(i.position2D.x, i.position2D.y));

        this.GenerateSpecialCombos(fruitsCombination); // 1

        await delay(300);

        this.DropColumn();
    }

    private GenerateSpecialCombos(fruitsCombination: CombinationResult[]) {

        for (let c of fruitsCombination) {
            let position = c.typeCombination.foundFruits[0].position2D;
            switch (c.typeCombination.NAME) {
                case TypeCombination.FIVE_HORIZONAL:
                case TypeCombination.FIVE_VERTICAL:
                    this.AddRainbowBomb(position.x, position.y);
                    break;
                case TypeCombination.FOUR_HORIZONAL:
                    this.AddFourHorizonalBomb(position.x, position.y);
                    break;
                case TypeCombination.FOUR_VERTICAL:
                    this.AddFourVerticalBomb(position.x, position.y);
                    break;
                case TypeCombination.LSHAPE:
                case TypeCombination.TSHAPE:
                    this.AddSquareBomb(position.x, position.y);
                    break;
                default:
                    break;
            }
        }
    }

    public DestroyMatchedFruitAt(x: number, y: number) {
        let fruit = this.AllFruit[x][y];

        if (fruit?.CanDestroy) {
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

        await delay(300);

        this.FullfillColumn();
    }

    private async FullfillColumn() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!this.AllFruit[i][j]) {
                    this.spawnNormalFruit(i, j);
                }
            }
        }

        await delay(300);

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

    public getColor(f: Fruit) {
        let fruits: Array<Fruit> = new Array();
        for (let i = 0; i < this.AllFruit.length; i++) {
            for (let j = 0; j < this.AllFruit[0].length; j++) {
                if (this.AllFruit[i][j].typeFruit === f.typeFruit) {
                    fruits.push(this.AllFruit[i][j]);
                }
            }
        }
        return fruits;
    }

    public getArea(f: Fruit) {
        let fruits: Array<Fruit> = new Array();
        for (let i = f.position2D.x - 1; i < f.position2D.x + 2; i++) {
            for (let j = f.position2D.y - 1; j < f.position2D.y + 2; j++) {
                if (this.IsPositionOnBoard(new Grid2D(i, j))) {
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


