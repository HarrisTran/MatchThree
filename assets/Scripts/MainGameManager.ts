import { _decorator, Component, director, find, instantiate, Node, Prefab, resources } from 'cc';
import { GameOverPopup } from './GameOverPopup';
const { ccclass, property } = _decorator;


///////////////////////////// Match 3:


// - Flow game (Man hình menu (PLay) => Ingame => GameOver Trả điểm)

// - Hiển thị điểm

// - Timer (đếm ngược đến khi game kết thúc - 60s)

// - Item đặc biệt

// - Item ngang/dọc


@ccclass('MainGameManager')
export class MainGameManager extends Component {
    @property(Prefab)
    private gameOverPopup : Prefab = null;

    @property({group: {name: "Special Prefabs", id : "1"}, type: Prefab})
    public horizonalRocket : Prefab = null;

    @property({group: {name: "Special Prefabs", id : "1"}, type: Prefab})
    public verticalRocket : Prefab = null;

    @property({group: {name: "Special Prefabs", id : "1"}, type: Prefab})
    public areaBomb : Prefab = null;

    @property({group: {name: "Special Prefabs", id : "1"}, type: Prefab})
    public rainbowBomb : Prefab = null;


    private static _instance : MainGameManager;
    private static readonly NORMAL_FRUIT_PREFAB_PATH: string = "NormalFruit";

    private fruitListPrefabs: Prefab[] = [];
    private specialFruitListPrefabs: Prefab[] = [];
    private score: number = 0;


    public static get instance(): MainGameManager{
        return this._instance;
    }

    protected onLoad(): void {
        this.score = 0;
        MainGameManager._instance = this;
        director.addPersistRootNode(this.node);
    }

    start() {
        resources.loadDir(MainGameManager.NORMAL_FRUIT_PREFAB_PATH, Prefab, (err: Error, data: Prefab[]) => {
            if(err) console.error("Can't load prefabs from empty path", err);
            else{
                for(let prefab of data){
                    this.fruitListPrefabs.push(prefab);
                }
            }
        });
    }

    onClickStartButton(){
        director.loadScene("GamePlay");
    }

    public get Score(){
        return this.score;
    }

    public set Score(score: number) {
        this.score += score;
    }

    public getNormalFruitListPrefab() : Prefab[] {
        return this.fruitListPrefabs;
    }

    public getSpecialFruitListPrefab() : Prefab[] {
        return this.specialFruitListPrefabs;
    }

    public onShowGameOverPopup(){
        let popup = instantiate(this.gameOverPopup);
        popup.parent = find("Canvas");
        popup.getComponent(GameOverPopup).onShowStart(this.Score);
    }
}


