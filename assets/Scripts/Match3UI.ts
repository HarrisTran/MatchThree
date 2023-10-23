import { _decorator, Component, error, instantiate, Layout, log, math, Node, Prefab, resources, Vec3 } from 'cc';
import { Fruit, Grid2D } from './Match3Component/Fruit';
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

    protected onLoad(): void {
        this.initializeGridUI();
        this.initializeTile();
    }

    private initializeGridUI(){
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let o = instantiate(this.tileBg);
                o.parent = this.gridLayout;
                o.name = `Tile ${i},${j}`;
            }
        }
        this.gridLayout.getComponent(Layout).updateLayout();
    }

    private initializeTile(){
        for (let i = 0; i < this.gridLayout.children.length; i++) {
            const x = Math.floor(i/8);
            const y = i%8;
            if(x>1)
            this.spawnFruit(x,y,this.gridLayout.children[i].getPosition());
        }
    }

    private spawnFruit(x: number, y: number, localPos: Vec3){
        let o = instantiate(this.fruitListPrefabs[math.randomRangeInt(0,7)]);
        o.getComponent(Fruit).position2D = new Grid2D(x,y);
        o.setPosition(localPos);
        o.parent = this.tileLayout;
    }

}


