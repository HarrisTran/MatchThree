import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameStart')
export class GameStart extends Component {
    onClickStart()
    {
        director.loadScene("GamePlay");
    }
}

