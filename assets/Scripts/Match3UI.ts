import { _decorator, Component, error, instantiate, Layout, log, math, Node, Prefab, resources, Vec2, Vec3 } from 'cc';
import { Fruit, MoveDirection } from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
import { convertTo2DArray, DistinctList } from './Util';
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
    private listAllMatch: DistinctList<Fruit> = new DistinctList<Fruit>();

    protected onLoad(): void {
        this.initializeGridUI();
        this.initializeTile();
        console.log(this.AllFruit);
        
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
        setTimeout(() => {
            this.FindAllMatch();
            if (this.listAllMatch.size() > 0) {
                this.listAllMatch.getList().forEach(item => {
                    this.DestroyMatchedFruitAt(item.position2D.x, item.position2D.y);
                });

                setTimeout(() => {
                    this.DropColumn();
                }, 200);
            }else{
                setTimeout(() => {
                    if(otherFruit){
                        f.swapTo(otherFruit);
                    }
                }, 100);
            }
        }, 100, this);
        // setTimeout(() => {
        //     this.DropColumn();
        // }, 200);
    }

    private FindAllMatch() {
        this.listAllMatch.clear();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const considerFruit = this.AllFruit[i][j];
                if(considerFruit)
                {
                    if (i > 0 && i < 7) {
                        let a = this.AllFruit[i + 1][j];
                        let b = this.AllFruit[i - 1][j];
                        if (a && b) {
                            if (considerFruit.compareTo(a) && considerFruit.compareTo(b)) {
                                this.listAllMatch.add(considerFruit);
                                this.listAllMatch.add(a);
                                this.listAllMatch.add(b);
                            }
                        }
                    }

                    if (j > 0 && j < 7)
                    {
                        let a = this.AllFruit[i][j + 1];
                        let b = this.AllFruit[i][j - 1];
                        if(a && b)
                        {
                            if(considerFruit.compareTo(a) && considerFruit.compareTo(b))
                            {
                                this.listAllMatch.add(considerFruit);
                                this.listAllMatch.add(a);
                                this.listAllMatch.add(b);
                            }
                        }
                    }
                }
            }
        }
    }

    private DestroyMatchedFruitAt(x: number, y: number) {
        let fruit = this.AllFruit[x][y];
        if (fruit) {
            fruit.node.destroy();
            this.AllFruit[x][y] = null;
        }
    }

    private DropColumn(){
        for (let i = 0; i < 8; i++) {
            let counter = 0;
            for (let j = 7; j >= 0; j--) {
                if(this.AllFruit[j][i] == null){
                    counter++;
                }else{
                    this.AllFruit[j][i].position2D.x += counter;
                    this.AllFruit[j+counter][i] = this.AllFruit[j][i];
                    this.AllFruit[j][i] = null;
                }
            }
        }
        setTimeout(() => {
            this.FullfillColumn();
        }, 200);
    }

    private FullfillColumn(){
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(!this.AllFruit[i][j]){
                    this.spawnFruit(i,j,this.GridCoodinator[i][j]);
                }
            }
        }

        setTimeout(() => {
            console.log("reCheckFruit")
            this.FindAllMatch();
            if (this.listAllMatch.size() > 0) {
                this.listAllMatch.getList().forEach(item => {
                    this.DestroyMatchedFruitAt(item.position2D.x, item.position2D.y);
                });

                setTimeout(() => {
                    this.DropColumn();
                }, 200);
            }
        }, 100, this);
    }
}


