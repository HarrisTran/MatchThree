import { _decorator, CCInteger, Component, Label, Node } from 'cc';
import { MainGameManager } from './MainGameManager';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property(Label)
    private timerText : Label = null;

    @property(Label)
    private scoreText : Label = null;

    @property(CCInteger)
    countTime: number = 0;

    private _timeLeft: number;
    private _isActive: boolean = false;

    protected onLoad(): void {
        this.startScreen(this.countTime);
    }

    public increaseTimeLeft(){
        this._timeLeft += 15;
    }

    public decreaseTimeLeft(){
        this._timeLeft -= 15;
    }

    public startScreen(time: number){
        this.node.active = true;
        this._timeLeft = time;
        this._isActive = true;
    }

    private onTimerReachedZero(){
        this._isActive = false;
        this.node.active = false;
        //this.popup.setPosition(0,0,0);
        
        //MainGameManager.instance.onShowGameOverPopup();
    }

    protected update(dt: number): void {
        if(this._isActive){
            this._timeLeft -= dt;
            this.setTimer(this._timeLeft);
            if(this._timeLeft <= 0){
                this.onTimerReachedZero();
            }
        }
    }

    private setTimer(time: number){
        this.timerText.string = Math.floor(time).toString()+"s";
    }

    showScore(n : number){
        this.scoreText.string = `Score : ${n}`
    }
}


