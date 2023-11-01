import { _decorator, CCInteger, Component, Enum, EventTouch, find, math, Node, tween, Vec2, Vec3 } from 'cc';
import { Grid2D } from './Grid2D';
import { Board } from '../Board';
import { easingMovement } from '../Util';
const { ccclass, property } = _decorator;

export enum TypeFruit{
    APPLE = 0,
    BANANA = 1,
    BLUE ,
    COCONUT ,
    GRAPES ,
    MELON ,
    ORANGE ,
}

export enum MoveDirection {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3,
}

@ccclass('Fruit')
export class Fruit extends Component {
    @property({type: Enum(TypeFruit)})
    public typeFruit: TypeFruit;

    @property(CCInteger)
    private scoreReward: number = 0;

    public position2D: Grid2D = null;

    public isMatched: boolean = false;
    private startPosition: Vec2;
    private endPosition: Vec2;
    private matchUI : Board;
    private timeThreshold: number = 0.25;

    protected onLoad(): void {
        this.matchUI = find("Canvas").getComponent(Board);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    public compareTo(other: Fruit){
        return this.typeFruit === other.typeFruit;
    }

    public onTouchStart(event : EventTouch){
        this.startPosition = event.getLocation();
    }

    public swapTo(other: Fruit) {
        if(!other) return;
        let temp = this.position2D;
        this.moveTo(other.position2D);
        other.moveTo(temp);
    }

    public moveTo(newPos: Grid2D){
        this.position2D = newPos;
    }

    public getScoreReward(){
        return this.scoreReward;
    }

    public onTouchCancel(event: EventTouch){
        this.endPosition = event.getLocation();
        this.movingDecision();
    }

    private movingDecision(){
        const deltaX = this.endPosition.x - this.startPosition.x;
        const deltaY = this.endPosition.y - this.startPosition.y;

        if(Math.abs(deltaX) > Math.abs(deltaY)){
            if(deltaX > 0){
                this.matchUI.swapTo(this,MoveDirection.RIGHT);
            }else{
                this.matchUI.swapTo(this,MoveDirection.LEFT);
            }
        }else{
            if(deltaY > 0){
                this.matchUI.swapTo(this,MoveDirection.UP);
            }else{
                this.matchUI.swapTo(this,MoveDirection.DOWN);
            }
        }
    }

    protected update(dt: number): void {
        let expectPosition = this.matchUI.GridCoodinator[this.position2D.x][this.position2D.y];
        let currentPosition = this.node.getPosition();

        let newPosition = easingMovement(currentPosition,expectPosition,dt/this.timeThreshold,(x:number)=>{
            return 1 - Math.pow(1-x,3);
        })

        this.node.setPosition(newPosition);
        this.matchUI.AllFruit[this.position2D.x][this.position2D.y] = this;
    }

    public onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchCancel, this);
    }

}



