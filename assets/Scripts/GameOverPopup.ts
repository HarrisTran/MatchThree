import { _decorator, Component, Label, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverPopup')
export class GameOverPopup extends Component {
    @property(Node)
    private overlayNode : Node = null;

    @property(Node)
    private panel: Node = null;

    @property(Label)
    private scoreNumber: Label = null;

    protected start(): void {
        this.panel.scale = Vec3.ZERO;
    }

    public onShowStart(score: number){
        this.overlayNode.active = true;
        
        this.scoreNumber.string = score.toString();

        tween(this.panel)
        .to(0.25,{scale: new Vec3(1,1,1)},{easing:"backIn"})
        .start();
    }
}


