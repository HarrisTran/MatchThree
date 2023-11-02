import { _decorator, Component, Node } from 'cc';
import { Board } from './Board';
import { areAllElementsSame, DistinctList } from './Util';
import { Fruit, TypeFruit} from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
const { ccclass, property } = _decorator;

@ccclass('MatchMachine')
export class MatchMachine extends Component {
    @property(Board)
    private board: Board;

    private listAllMatch: DistinctList<Fruit> = new DistinctList<Fruit>();
    private listAllSpecialPosition: DistinctList<SpecialTile> = new DistinctList<SpecialTile>();

    public get ListAllMatch(){
        this.listAllMatch.clear();
        this.listAllSpecialPosition.clear();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const considerFruit = this.board.AllFruit[i][j];
                if(considerFruit)
                {
                    this.CheckMatches(considerFruit,i,j,1,0);
                    this.CheckMatches(considerFruit,i,j,0,1);
                }
            }
        }
        
        return this.listAllMatch;
    }

    public get ListAllSpecialPostion(){
        return this.listAllSpecialPosition;
    }

    private CheckMatches(fruit: Fruit, startRow: number, startColumn: number, rowDirection: number, colDirection: number) {
        let matchCount = 1;
        let matchedPositions : Fruit[] = [];
        if(this.listAllSpecialPosition.size() !== 0) return;
         
        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow + rowDirection * i;
            const currentCol = startColumn + colDirection * i;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                matchCount ++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
                console.log(matchedPositions.length);
                
            }else{
                break;
            }
        }

        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow - rowDirection * i;
            const currentCol = startColumn - colDirection * i;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                matchCount ++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
                console.log(matchedPositions.length);
            }else{
                break;
            }
        }

        if (matchCount >= 3) {
            matchedPositions.push(fruit);
            for(let i of matchedPositions){
                this.board.AllFruit[i.position2D.x][i.position2D.y].isMatched = true;
                this.listAllMatch.add(this.board.AllFruit[i.position2D.x][i.position2D.y]);
            }
            if(matchCount == 4){
                if(areAllElementsSame(matchedPositions.map(e => e.position2D),"x")){
                    this.listAllSpecialPosition.add(new SpecialTile(TypeFruit.BOMB_HORIZONAL,matchedPositions));
                }
                else if (areAllElementsSame(matchedPositions.map(e => e.position2D),"y")){
                    this.listAllSpecialPosition.add(new SpecialTile(TypeFruit.BOMB_VERTICAL, matchedPositions));
                }
            }                    
            if(matchCount >= 5){
                this.listAllSpecialPosition.add(new SpecialTile(TypeFruit.RAINBOW,matchedPositions));
            }      
                                                                                                                             
        }        

    }

    public MarkAllRow(row: number){
        let fruits : Array<Fruit> = new Array();
        for(let x of this.board.getRow(row)){
            fruits.push(x);
            x.isMatched = true;
        }
        return fruits;
    }

    public MarkAllColumn(column: number){
        let fruits : Array<Fruit> = new Array();
        for(let x of this.board.getRow(column)){
            fruits.push(x);
            x.isMatched = true;
        }
        return fruits;
    }
}

export interface InterfaceMatchMachine extends MatchMachine {}

export class SpecialTile {
    typeTile: TypeFruit;
    tileCluster : Fruit[];
    constructor(typeTile: TypeFruit, tiles: Fruit[]){
        this.typeTile = typeTile;
        this.tileCluster = tiles;
    }
}
