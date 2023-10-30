import { _decorator, CCInteger, Component, Enum, EventTouch, find, math, Node, Vec2, Vec3 } from 'cc';
import { Grid2D } from './Grid2D';
import { Board } from '../Board';
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

    protected start(): void {
        console.log("as")
    }

    public onTouchStart(event : EventTouch){
        this.startPosition = event.getLocation();
        
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
                this.matchUI.swapFruit(this,MoveDirection.RIGHT);
            }else{
                this.matchUI.swapFruit(this,MoveDirection.LEFT);
            }
        }else{
            if(deltaY > 0){
                this.matchUI.swapFruit(this,MoveDirection.UP);
            }else{
                this.matchUI.swapFruit(this,MoveDirection.DOWN);
            }
        }
    }

    protected update(dt: number): void {
        let expectPosition = this.matchUI.GridCoodinator[this.position2D.x][this.position2D.y];
        let currentPosition = this.node.getPosition();

        const t = dt/this.timeThreshold;
        const easing = 1 - (1-t)*(1-t);

        let newPosition = new Vec3(
            math.lerp(currentPosition.x, expectPosition.x, easing),
            math.lerp(currentPosition.y, expectPosition.y, easing),
            0
        );

        this.node.setPosition(newPosition);
        this.matchUI.AllFruit[this.position2D.x][this.position2D.y] = this;
    }

    public onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchCancel, this);
    }

    public swapTo(other: Fruit) {
        let temp = this.position2D;
        this.position2D = other.position2D;
        other.position2D = temp;
    }

    public     getScoreReward(){
        return this.scoreReward;
    }
}



