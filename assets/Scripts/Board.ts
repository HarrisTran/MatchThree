import { _decorator, Component, find, instantiate, Label, Layout, log, Node, Prefab, Size, Vec3 } from 'cc';
import { Fruit, MoveDirection} from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
import { convertTo1DArray, convertTo2DArray, delay, randomInRange } from './Util';
import { MainGameManager, TypeFruit} from './MainGameManager';
import { MatchMachine } from './MatchMachine';
import { FruitCombination, TypeCombination } from './Match3Combination/CombinationBase';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

const arrayLogo = [
    {pos: new Grid2D(0, 0), type: 'smile'},
    {pos: new Grid2D(0, 1), type: 'smile'},
    {pos: new Grid2D(0, 2), type: 'i'},
    {pos: new Grid2D(0, 3), type: 'i'},
    {pos: new Grid2D(0, 4), type: 'd'},
    {pos: new Grid2D(0, 5), type: 'd'},
];

@ccclass('Board')
export class Board extends Component {
    @property(UIManager)
    ui: UIManager = null;

    @property(Size)
    public sizeBoard: Size = null;

    @property(Node)
    private gridLayout: Node = null;

    @property(Node)
    private tileLayout: Node = null;

    @property(MatchMachine)
    private matcher: MatchMachine = null;

    private firstChoosed: Fruit = null;
    private secondChoosed: Fruit = null;

    public AllFruit: Fruit[][] = [];
    public GridCoodinator: Vec3[][] = [];

    private isPlaying: boolean = false;

    /// Setup for the game
    protected onLoad(): void {
        this.initialize();
    }

    private initialize() 
    {
        this.GridCoodinator = convertTo2DArray(this.gridLayout.children.map(child => child.position), this.sizeBoard.x, this.sizeBoard.y);
        this.AllFruit = new Array(this.sizeBoard.x);
        for(let i=0; i < this.sizeBoard.y; i++)
        {
            this.AllFruit[i] = new Array(this.sizeBoard.y);
        }
        for (let i = 0; i < this.gridLayout.children.length; i++) {
            let x: number = Math.floor(i / this.sizeBoard.x);
            let y: number = i % this.sizeBoard.y;
            
            // let ii = arrayLogo.findIndex(a => a.pos.compareTo(new Grid2D(x,y)));
            // if(ii > -1){
            //     switch (arrayLogo[ii].type) {
            //         case 'smile':
            //             this.AddExtra(x,y);
            //             break;
            //         case 'i':
            //             this.AddIncreaseTime(x,y);
            //             break;
            //         case 'd':
            //             this.AddDecreaseTime(x,y);
            //             break;
            //         default:
            //             break;
            //     }
            // }else{
            //     this.spawnNormalFruit(x, y);
            // }
            this.spawnNormalFruit(x, y);
            if (this.checkMatchAt(x, y, this.AllFruit[x][y])) {
                this.AllFruit[x][y].node.destroy();
                i--;
            }
        }
    }

    private AddIncreaseTime(x: number, y: number) {
        let o = MainGameManager.instance.getFruitByName('IncreaseTime');
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0),o);
    }

    private AddDecreaseTime(x: number, y: number) {
        let o = MainGameManager.instance.getFruitByName('DecreaseTime');
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0),o);
    }

    private AddExtra(x: number, y: number) {
        let o = MainGameManager.instance.getFruitByName('ExtraPoint');
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0),o);
    }

    /// Spawn title for the grid
    private AddRainbowBomb(x: number, y: number) {
        let o = MainGameManager.instance.getFruitByName('RainbowBomb');
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0),o);
    }

    private AddFourHorizonalBomb(x: number, y: number) {
        let o = MainGameManager.instance.getFruitByName('HorizonalRocket');
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0), o);
    }  

    private AddFourVerticalBomb(x: number, y: number) {
        let o = MainGameManager.instance.getFruitByName('VerticalRocket');
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0), o);
    }

    private AddSquareBomb(x: number, y: number) {
        let o = MainGameManager.instance.getFruitByName('SquareBomb');
        this.spawnNewFruit(x, y, new Vec3(0, 0, 0), o);
    }

    private spawnNormalFruit(x: number, y: number) {
        let o = MainGameManager.instance.getRandomNormalFruit();
        this.spawnNewFruit(x, y, new Vec3(0, 250, 0), o);
    }

    private spawnNewFruit(x: number, y: number, offset: Vec3, prefab: Prefab) {

        let newNode = instantiate(prefab);

        newNode.setPosition(this.GridCoodinator[x][y].clone().add(offset));
        newNode.parent = this.tileLayout;

        this.AllFruit[x][y] = newNode.getComponent(Fruit);
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

        if (m == MoveDirection.RIGHT && f.position2D.y < 5) {
            otherFruit = this.AllFruit[f.position2D.x][f.position2D.y + 1];
            f.swapTo(otherFruit);
        }
        else if (m == MoveDirection.LEFT && f.position2D.y > 0) {
            otherFruit = this.AllFruit[f.position2D.x][f.position2D.y - 1];
            f.swapTo(otherFruit);
        }
        else if (m == MoveDirection.DOWN && f.position2D.x < 5) {
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

        if (!this.CheckMove()) { // check if move don't match
            f.swapTo(otherFruit); // dont match, so swap again
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


    private async DestroyAllCombination(result: FruitCombination[]) { // 0
        this.isPlaying = true;
        let hellStorage: Fruit[] = [];

        for (let i = 0; i < this.AllFruit.length; i++) {
            if (this.AllFruit[this.sizeBoard.x-1][i].isLogo) {
                this.AllFruit[this.sizeBoard.x-1][i].forceDestroy();
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

        this.GenerateSpecialCombos(result); // 1

        await delay(300);

        this.DropColumn();
    }

    private GenerateSpecialCombos(result: FruitCombination[]) {

        for (let c of result) {
            let position = c.foundFruits[0].position2D;
            switch (c.nameOfCombination) {
                case TypeCombination.FIVE_HORIZONAL:
                case TypeCombination.FIVE_VERTICAL:
                    this.AddRainbowBomb(position.x, position.y);
                    break;
                case TypeCombination.FOUR_HORIZONAL:
                    let v : Fruit = null;
                    for(let i of c.foundFruits)
                    {
                        for(let j of [this.firstChoosed, this.secondChoosed])
                        {
                            if(i.position2D.compareTo(j.position2D))
                            {
                                v = j;
                                break;
                            }
                        }
                    }
                    if(v == null) v = c.foundFruits[0];
                    this.AddFourHorizonalBomb(v.position2D.x, v.position2D.y);
                    break;
                case TypeCombination.FOUR_VERTICAL:
                    let u : Fruit = null;
                    for(let i of c.foundFruits)
                    {
                        for(let j of [this.firstChoosed, this.secondChoosed])
                        {
                            if(i.position2D.compareTo(j.position2D))
                            {
                                u = j;
                                break;
                            }
                        }
                    }
                    if(u == null) u = c.foundFruits[0];
                    this.AddFourVerticalBomb(u.position2D.x, u.position2D.y);
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
        let typeSpecial = fruit.typeFruit;

        if (fruit?.CanDestroy) {
            fruit.node.destroy();
            if(typeSpecial === TypeFruit.DECREASE_TIME){
                this.ui.decreaseTimeLeft();
            }else if( typeSpecial === TypeFruit.INCREASE_TIME){
                this.ui.increaseTimeLeft();
            }else{
                MainGameManager.instance.userData.score += fruit.getScoreReward();
                this.ui.showScore(MainGameManager.instance.userData.score);
            }
            
            this.AllFruit[x][y] = null;
        }
    }

    private async DropColumn() {
        for (let i = 0; i < this.sizeBoard.x; i++) {
            let counter = 0;
            for (let j = this.sizeBoard.x-1; j >= 0; j--) {
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
        for (let i = 0; i < this.sizeBoard.x; i++) {
            for (let j = 0; j < this.sizeBoard.x; j++) {
                if (!this.AllFruit[i][j]) {
                    this.spawnNormalFruit(i, j);
                }
            }
        }

        await delay(300);

        let combinationList = this.matcher.FindFruitCombinations(convertTo1DArray(this.AllFruit));
        if(combinationList.length == 0){
            this.isPlaying = false;
            if(this.searchPotentialMove()){
                console.log("Can move");
            }else{
                console.log("Cannot move");
            }
        }else{
            this.DestroyAllCombination(combinationList);
        }
        
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

    public searchPotentialMove()  : boolean
    {
        for (let i = 0; i < this.sizeBoard.x; i++) {
            for (let j = 0; j < this.sizeBoard.y; j++) {
                let t : Fruit = this.AllFruit[i][j];
                /*
                 *  ??X
                 */
                if(j >= 3 && this.AllFruit[j-3][i].compareTo(t) && this.AllFruit[i][j-3].compareTo(t))
                {
                    return true;
                }
                /*
                 *  X??
                 */
                if(j+3 < this.sizeBoard.y && this.AllFruit[i][j+3].compareTo(t) && this.AllFruit[i][j+2].compareTo(t))
                {
                    return true;
                }
                /*
                 *  ?
                 *  ? 
                 *  X
                 */
                if(i >= 3 && this.AllFruit[i-2][j].compareTo(t) && this.AllFruit[i-3][j].compareTo(t))
                {
                    return true;
                }
                /*
                 *  X
                 *  ? 
                 *  ?
                 */
                if(i+3 < this.sizeBoard.x && this.AllFruit[i+2][j].compareTo(t) && this.AllFruit[i+3][j].compareTo(t))
                {
                    return true;
                }
                /*    o   ?
                 *  o o   ? ?
                 *      X
                 *    o   ?
                 */
                if(i > 1)
                {
                    if(j > 1 && this.AllFruit[i-1][j-1].compareTo(t))
                    {
                        if((j >=2 && this.AllFruit[i-1][j-2].compareTo(t)) ||
                           (j+1 < this.sizeBoard.y && this.AllFruit[i-1][j+1].compareTo(t))){
                            return true;
                        }
                        if((i >=2 && this.AllFruit[i-2][j-1].compareTo(t)) ||
                           (i+1 < this.sizeBoard.y && this.AllFruit[i+1][j-1].compareTo(t))){
                            return true;
                        }
                    }
                    if(j+1 < this.sizeBoard.y && this.AllFruit[i-1][j+1].compareTo(t))
                    {
                        if(j+2 < this.sizeBoard.y && this.AllFruit[i-1][j+2].compareTo(t)){
                            return true;
                        }
                        if((i >=2 && this.AllFruit[i-2][j+1].compareTo(t)) ||
                           (i+1 < this.sizeBoard.y && this.AllFruit[i+1][j+1].compareTo(t))){
                            return true;
                        }
                    }
                }
                /*    o   ?
                 *  o o   ? ?
                 *      X
                 *  o o   ? ?
                 *    o   ?
                 */
                if(i+1 < this.sizeBoard.y)
                {
                    if(j > 1 && this.AllFruit[i+1][j-1].compareTo(t))
                    {
                        if((j >=2 && this.AllFruit[i+1][j-2].compareTo(t)) ||
                           (j+1 < this.sizeBoard.y && this.AllFruit[i+1][j+1].compareTo(t))){
                            return true;
                        }
                        if((i+2 < this.sizeBoard.x && this.AllFruit[i+2][j-1].compareTo(t)) ||
                           (i >= 2 && this.AllFruit[i-1][j-1].compareTo(t))){
                            return true;
                        }
                    }
                    if(j+1 < this.sizeBoard.y && this.AllFruit[i+1][j+1].compareTo(t))
                    {
                        if(j+2 < this.sizeBoard.y && this.AllFruit[i+1][j+2].compareTo(t)){
                            return true;
                        }
                        if((i+2 < this.sizeBoard.x && this.AllFruit[i+2][j+1].compareTo(t)) ||
                           (i>=2 && this.AllFruit[i-1][j+1].compareTo(t))){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

}


