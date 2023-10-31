import { _decorator, Component, Node } from 'cc';
import { Board } from './Board';
import { DistinctList } from './Util';
import { Fruit } from './Match3Component/Fruit';
const { ccclass, property } = _decorator;

@ccclass('MatchMachine')
export class MatchMachine extends Component {
    @property(Board)
    private board: Board;

    private listAllMatch: DistinctList<Fruit> = new DistinctList<Fruit>();

    public get ListAllMatch(){
        this.listAllMatch.clear();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const considerFruit = this.board.AllFruit[i][j];
                if(considerFruit)
                {
                    if (i > 0 && i < 7) {
                        let a = this.board.AllFruit[i + 1][j];
                        let b = this.board.AllFruit[i - 1][j];
                        if (a && b) {
                            if (considerFruit.compareTo(a) && considerFruit.compareTo(b)) {
                                this.listAllMatch.add(considerFruit);
                                this.listAllMatch.add(a);
                                this.listAllMatch.add(b);
                            }
                        }
                    }

                    if (j > 0 && j < 7)
                    {
                        let a = this.board.AllFruit[i][j + 1];
                        let b = this.board.AllFruit[i][j - 1];
                        if(a && b)
                        {
                            if(considerFruit.compareTo(a) && considerFruit.compareTo(b))
                            {
                                this.listAllMatch.add(considerFruit);
                                this.listAllMatch.add(a);
                                this.listAllMatch.add(b);
                            }
                        }
                    }
                }
            }
        }
        console.log(this.listAllMatch.getList().length);
        
        return this.listAllMatch;
    }

}

export interface InterfaceMatchMachine extends MatchMachine {}


