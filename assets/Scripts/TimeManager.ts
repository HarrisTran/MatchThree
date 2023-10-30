import { _decorator, Component, Label, Node } from 'cc';
import { MainGameManager } from './MainGameManager';
const { ccclass, property } = _decorator;

@ccclass('TimeManager')
export class TimeManager extends Component {
    @property(Label)
    private timerText : Label = null;

    private _timeLeft: number;
    private _isActive: boolean = false;

    protected onLoad(): void {
        this.startScreen(60);
    }

    public startScreen(time: number){
        this.node.active = true;
        this._timeLeft = time;
        this._isActive = true;
    }

    private onTimerReachedZero(){
        this._isActive = false;
        this.node.active = false;
        MainGameManager.instance.onShowGameOverPopup();
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
}


