import { _decorator, Component, Label, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverPopup')
export class GameOverPopup extends Component {
    @property(Node)
    private panel: Node = null;

    @property(Label)
    private scoreNumber: Label = null;

    public onShowStart(score: number){
        this.node.active = true;
        this.panel.scale = Vec3.ZERO;
        this.scoreNumber.string = score.toString();

        tween(this.panel)
        .to(0.25,{scale: new Vec3(1,1,1)},{easing:"backIn"})
        .start();
    }
}


