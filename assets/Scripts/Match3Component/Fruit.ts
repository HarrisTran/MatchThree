import { _decorator, Component, Enum, EventTouch, find, Node, Vec2 } from 'cc';
import { Grid2D } from './Grid2D';
import { Match3UI } from '../Match3UI';
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

    public position2D: Grid2D = null;

    private startPosition: Vec2;
    private endPosition: Vec2;
    private matchUI : Match3UI;

    protected onLoad(): void {
        this.matchUI = find("Canvas").getComponent(Match3UI);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public compareTo(other: Fruit){
        return this.typeFruit === other.typeFruit;
    }

    public onTouchStart(event : EventTouch){
        this.startPosition = event.getLocation();
    }


    public onTouchEnd(event: EventTouch){
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

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}



