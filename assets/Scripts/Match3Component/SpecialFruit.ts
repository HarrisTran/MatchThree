import { _decorator, Component, Enum, Node } from 'cc';
import { Fruit } from './Fruit';
const { ccclass, property } = _decorator;

@ccclass('SpecialFruit')
export class SpecialFruit extends Fruit {

    protected onDestroy(): void {
        super.onDestroy();
    }

}


