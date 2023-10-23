import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Fruit')
export class Fruit extends Component {

    public position2D: Grid2D = null;
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}

export class Grid2D  {
    x: number;
    y: number;

    constructor(x: number, y:number){
        this.x = x;
        this.y = y;
    }
}


