import { _decorator, Component, error, instantiate, Layout, log, math, Node, Prefab, resources, Vec2, Vec3 } from 'cc';
import { Fruit, MoveDirection } from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
import { convertTo2DArray } from './Util';
import { Match, MatchType } from './Match3Component/Match';
const { ccclass, property } = _decorator;

@ccclass('Match3UI')
export class Match3UI extends Component {

    @property(Node)
    private gridLayout: Node = null;

    @property(Node)
    private tileLayout: Node = null;

    @property(Prefab)
    private tileBg: Prefab = null;

    @property([Prefab])
    private fruitListPrefabs: Prefab[] = [];

    public AllFruit: Fruit[][] = [];
    public GridCoodinator: Vec3[][] = [];
    private listAllMatch: Set<Fruit> = new Set<Fruit>();

    protected onLoad(): void {
        this.initializeGridUI();
        this.initializeTile();
    }

    private initializeGridUI() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let o: Node = instantiate(this.tileBg);
                o.parent = this.gridLayout;
                o.name = `Tile ${i},${j}`;
            }
        }
        this.gridLayout.getComponent(Layout).updateLayout();
        this.GridCoodinator = convertTo2DArray<Vec3>([...this.gridLayout.children].map(child => child.getPosition()), 8, 8);
    }

    private initializeTile() {
        this.AllFruit = convertTo2DArray<Fruit>(new Array(64).fill(null), 8, 8);
        for (let i = 0; i < this.gridLayout.children.length; i++) {
            const x: number = (i / 8) | 0;
            const y: number = i % 8;
            this.spawnFruit(x, y, this.gridLayout.children[i].getPosition());
            if (this.checkMatchAt(x, y, this.AllFruit[x][y])) {
                this.AllFruit[x][y].node.destroy();
                i--;
            }
        }
    }

    private spawnFruit(x: number, y: number, localPos: Vec3) {
        let o: Node = instantiate(this.fruitListPrefabs[math.randomRangeInt(0, 7)]);
        o.setPosition(localPos);
        o.parent = this.tileLayout;

        this.AllFruit[x][y] = o.getComponent(Fruit);
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

    public swapFruit(f: Fruit, m: MoveDirection) {
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

        this.FindAllMatch();
    }

    private FindAllMatch() {
        console.log("Find all match");
        for (let i = 1; i < 7; i++) {
            console.log(this.AllFruit[i][0].node.name+" "+this.AllFruit[i][1].node.name+" "+this.AllFruit[i][2].node.name+" "+this.AllFruit[i][3].node.name+" "+this.AllFruit[i][4].node.name+" "+this.AllFruit[i][5].node.name+" "+this.AllFruit[i][6].node.name+" "+this.AllFruit[i][7].node.name);
        }
        for (let i = 1; i < 7; i++) {
            for (let j = 1; j < 7; j++) {
                const considerFruit = this.AllFruit[i][j];
                if(considerFruit.node.name === this.AllFruit[i+1][j].node.name && considerFruit.node.name === this.AllFruit[i-1][j].node.name ){
                    console.log("Found doc");
                }
                if(considerFruit.node.name === this.AllFruit[i][j-1].node.name && considerFruit.node.name === this.AllFruit[i][j-1].node.name ){
                    console.log("Found ngang")
                }
            }
        }
    }



}


