import { _decorator, Component, Node } from 'cc';
import { Fruit } from './Fruit';
import { Board } from '../Board';
const { ccclass, property } = _decorator;

@ccclass('LogoFruit')
export class LogoFruit extends Fruit {
    protected update(dt: number): void {
        super.update(dt);
        if(this.position2D.x == 7){
            
        }
    }
    
}

