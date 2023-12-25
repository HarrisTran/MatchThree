import { _decorator, Component, director, find, instantiate, Node, Prefab, resources } from 'cc';
import { GameOverPopup } from './GameOverPopup';
const { ccclass, property } = _decorator;



export enum TypeFruit{
    APPLE = 0,
    BANANA = 1,
    BLUE  ,
    COCONUT ,
    GRAPES ,
    MELON ,
    ORANGE ,
    BOMB_VERTICAL ,
    BOMB_HORIZONAL ,
    BOMB_SQUARE ,
    RAINBOW ,
    
    EXTRA_POINT,
    INCREASE_TIME ,
    DECREASE_TIME ,
}

class DataPlayer {
    score: number;
    constructor(){
        this.score = 0;
    }
}

@ccclass('MainGameManager')
export class MainGameManager extends Component {

    @property({group: {name: "Special Prefabs", id : "1"}, type: Prefab})
    public horizonalRocket : Prefab = null;

    @property({group: {name: "Special Prefabs", id : "1"}, type: Prefab})
    public verticalRocket : Prefab = null;

    @property({group: {name: "Special Prefabs", id : "1"}, type: Prefab})
    public squareBomb : Prefab = null;

    @property({group: {name: "Special Prefabs", id : "1"}, type: Prefab})
    public rainbowBomb : Prefab = null;

    @property({type: Prefab})
    public extraPointPrefab : Prefab = null;

    @property({type: Prefab})
    public decreaseTimePrefab : Prefab = null;

    @property({type: Prefab})
    public increaseTimePrefab : Prefab = null;

    private static _instance : MainGameManager;
    private static readonly NORMAL_FRUIT_PREFAB_PATH: string = "NormalFruit";

    //public fruitListPrefabs: Prefab[] = [];

    public fruitMap : Map<string, Prefab> = new Map<string, Prefab>();
    public normalFruitListName : string [] = [];
    public specialFruitListName : string [] = [];
    public extraFruitListName : string [] = [];

    public userData: DataPlayer;


    public static get instance(): MainGameManager{
        return this._instance;
    }

    protected onLoad(): void {
        MainGameManager._instance = this;
        director.addPersistRootNode(this.node);

        this.userData = new DataPlayer();
        resources.loadDir(MainGameManager.NORMAL_FRUIT_PREFAB_PATH, Prefab, (err: Error, data: Prefab[]) => {
            if(err) console.error("Can't load prefabs from empty path", err);
            else{
                for(let prefab of data){
                    this.normalFruitListName.push(prefab.name);
                    this.fruitMap.set(prefab.name, prefab);
                }
            }
        });

        for(let prefab of [this.horizonalRocket,this.verticalRocket,this.squareBomb,this.rainbowBomb]){
            this.specialFruitListName.push(prefab.name);
            this.fruitMap.set(prefab.name, prefab);
        }

        for(let prefab of [this.increaseTimePrefab,this.decreaseTimePrefab,this.extraPointPrefab]){
            this.extraFruitListName.push(prefab.name);
            this.fruitMap.set(prefab.name, prefab);
        }
    }

    public getFruitByName(name: string) : Prefab{
        return this.fruitMap.get(name);
    }

    public getRandomNormalFruit(): Prefab
    {
        let index = Math.floor(Math.random()*this.normalFruitListName.length);
        return this.fruitMap.get(this.normalFruitListName[index]);
    }
}


