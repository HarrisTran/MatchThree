import { _decorator, CCBoolean, CCInteger, Component, Enum, Event, Eventify, EventTarget, EventTouch, find, game, log, math, Node, PipelineEventProcessor, systemEvent, SystemEvent, tween, Vec2, Vec3 } from 'cc';
import { Grid2D } from './Grid2D';
import { Board } from '../Board';
import { easingMovement } from '../Util';
import { TypeFruit } from '../MainGameManager';
const { ccclass, property } = _decorator;


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

    @property(CCBoolean)
    public isLogo: boolean = false;

    public position2D: Grid2D = null;

    private startPosition: Vec2 = null;
    private endPosition: Vec2 = null;

    private canDestroy : boolean = false;

    protected matchUI : Board;

    protected onLoad(): void {
        this.matchUI = find("Canvas").getComponent(Board);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    public compareTo(other: Fruit){
        return this.typeFruit === other.typeFruit;
    }

    protected onTouchStart(event : EventTouch){
        this.startPosition = event.getLocation();
    }

    public swapTo(other: Fruit) {
        if(!other) return;
        let temp = this.position2D;
        this.moveTo(other.position2D);
        other.moveTo(temp);
    }

    public set CanDestroy(canDestroy: boolean){
        if(this.isLogo) return;
        this.canDestroy = canDestroy;
    }

    public get CanDestroy(): boolean {
        return this.canDestroy;
    }

    public forceDestroy(){
        this.canDestroy = true;
    }

    public moveTo(newPos: Grid2D){
        this.position2D = newPos;
    }

    public getScoreReward(){
        return this.scoreReward;
    }

    protected onTouchCancel(event: EventTouch){
        this.endPosition = event.getLocation();
        this.movingDecision();
    }

    protected movingDecision(){
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

        this.node.position = easingMovement(currentPosition,expectPosition,dt);
        this.matchUI.AllFruit[this.position2D.x][this.position2D.y] = this;
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchCancel, this);
    }

    public isNormal(): boolean{
        return this.typeFruit == TypeFruit.APPLE || 
        this.typeFruit == TypeFruit.BANANA ||
        this.typeFruit == TypeFruit.BLUE ||
        this.typeFruit == TypeFruit.COCONUT ||
        this.typeFruit == TypeFruit.GRAPES ||
        this.typeFruit == TypeFruit.MELON ||
        this.typeFruit == TypeFruit.ORANGE;

    }

}



