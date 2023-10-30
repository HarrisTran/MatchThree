import { _decorator, Component, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverPopup')
export class GameOverPopup extends Component {
    @property(Node)
    private panel: Node = null;

    public onShowStart(){
        this.node.active = true;
        this.panel.scale = Vec3.ZERO;

        tween(this.panel)
        .to(0.25,{scale: new Vec3(1,1,1)})
        .start();
    }
}


