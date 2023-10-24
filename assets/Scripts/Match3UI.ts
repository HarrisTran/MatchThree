import { _decorator, Component, error, instantiate, Layout, log, math, Node, Prefab, resources, Vec3 } from 'cc';
import { Fruit, MoveDirection} from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
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

    private AllFruit: Fruit[][] = [];

    protected onLoad(): void 
    {
        this.initializeGridUI();
        this.initializeTile();  
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                console.log(this.AllFruit[i][j].node.name+"["+i+","+j+"]");
            }
            console.log("\n") 
        }      
    }

    private initializeGridUI(){
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let o : Node = instantiate(this.tileBg);
                o.parent = this.gridLayout;
                o.name = `Tile ${i},${j}`;
            }
            this.AllFruit.push(new Array<Fruit>(8));
        }
        this.gridLayout.getComponent(Layout).updateLayout();
    }

    private initializeTile(){
        for (let i = 0; i < this.gridLayout.children.length; i++) {
            const x : number = (i/8) | 0;
            const y : number = i%8;
            this.spawnFruit(x,y,this.gridLayout.children[i].getPosition());
            if(this.checkMatchAt(x,y,this.AllFruit[x][y])){
                this.AllFruit[x][y].node.destroy();
                i--;
            }
        }
    }

    private spawnFruit(x: number, y: number, localPos: Vec3){
        let o : Node = instantiate(this.fruitListPrefabs[math.randomRangeInt(0,7)]);
        o.setPosition(localPos);
        o.parent = this.tileLayout;

        this.AllFruit[x][y] = o.getComponent(Fruit);
        this.AllFruit[x][y].position2D = new Grid2D(x,y);
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

    public swapFruit(f: Fruit, m: MoveDirection ){
        console.log("Self",f.node.name);
        let otherFruit : Fruit = null;
        if(m == MoveDirection.RIGHT && f.position2D.x < 7)
        {
            otherFruit = this.AllFruit[f.position2D.x+1][f.position2D.y];
        }
        else if(m == MoveDirection.LEFT && f.position2D.x > 0)
        {
            otherFruit = this.AllFruit[f.position2D.x-1][f.position2D.y];
        }
        else if(m == MoveDirection.DOWN && f.position2D.y < 7)
        {
            otherFruit = this.AllFruit[f.position2D.x][f.position2D.y-1];
        }
        else if(m == MoveDirection.UP && f.position2D.y > 0)
        {
            otherFruit = this.AllFruit[f.position2D.x][f.position2D.y+1];
        }
        console.log("otherFruit",otherFruit.node.name);
    }

}


