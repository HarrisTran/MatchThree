import { _decorator, Component, Node } from 'cc';
import { Board } from './Board';
import { areCollinearPoints, DistinctList } from './Util';
import { Fruit, TypeFruit } from './Match3Component/Fruit';
import { Grid2D } from './Match3Component/Grid2D';
const { ccclass, property } = _decorator;

@ccclass('MatchMachine')
export class MatchMachine extends Component {
    @property(Board)
    private board: Board;

    private listAllMatch: DistinctList<Fruit> = new DistinctList<Fruit>();
    private listAllSpecialPosition: DistinctList<GroupOfFruit> = new DistinctList<GroupOfFruit>();

    public get ListAllMatch() {
        this.listAllMatch.clear();
        this.listAllSpecialPosition.clear();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.CheckMatches(this.board.AllFruit[i][j], i, j);
            }
        }
        return this.listAllMatch;
    }

    public get ListAllSpecialPostion() {
        return this.listAllSpecialPosition;
    }

    private CheckMatches(fruit: Fruit, startRow: number, startColumn: number) {
        if(!fruit || this.listAllSpecialPosition.size() > 0) return;

        let matchCount = 1;
        let matchedPositions: Fruit[] = [fruit];

        let rowCount = 0;
        let columnCount = 0;

        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow + i;
            const currentCol = startColumn ;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                //matchCount++;
                columnCount++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
            } else {
                break;
            }
        }

        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow - i;
            const currentCol = startColumn ;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                //matchCount++;
                columnCount++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
            } else {
                break;
            }
        }

        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow;
            const currentCol = startColumn + i;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                // matchCount++;
                rowCount++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
            } else {
                break;
            }
        }

        for (let i = 1; i <= 4; i++) {
            const currentRow = startRow ;
            const currentCol = startColumn - i;
            if (this.board.IsPositionOnBoard(new Grid2D(currentRow, currentCol)) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
                // matchCount++;
                rowCount++;
                matchedPositions.push(this.board.AllFruit[currentRow][currentCol]);
            } else {
                break;
            }
        }

        if (rowCount + columnCount >= 2) {
            for (let i of matchedPositions) {
                this.board.AllFruit[i.position2D.x][i.position2D.y].isMatched = true;
                this.listAllMatch.add(this.board.AllFruit[i.position2D.x][i.position2D.y]);
            }
        }

        if(rowCount + columnCount >= 3) this.MarkAndAddSpecialFruit(matchedPositions,rowCount,columnCount);
    }

    public MarkAndAddSpecialFruit(matchedPositions : Fruit[], rowCount: number, columnCount: number){
        console.log(rowCount,columnCount);
        
        
        if (rowCount == 4 || columnCount == 4) {
            this.listAllSpecialPosition.add(new GroupOfFruit(TypeFruit.RAINBOW, matchedPositions));
        }
        else if(rowCount >= 2 || columnCount >= 2){
            console.log("BOMB!");
        }else if(rowCount == 3 && columnCount <= 1){
            this.listAllSpecialPosition.add(new GroupOfFruit(TypeFruit.BOMB_HORIZONAL, matchedPositions));
        }else if(columnCount == 3 && rowCount <= 1){
            this.listAllSpecialPosition.add(new GroupOfFruit(TypeFruit.BOMB_VERTICAL, matchedPositions));
        }else{
            for (let i of matchedPositions) {
                this.board.AllFruit[i.position2D.x][i.position2D.y].isMatched = true;
                this.listAllMatch.add(this.board.AllFruit[i.position2D.x][i.position2D.y]);
            }
        }

    }

    public MarkAllRow(row: number) {
        let fruits: Array<Fruit> = new Array();
        for (let x of this.board.getRow(row)) {
            fruits.push(x);
            x.isMatched = true;
        }
        return fruits;
    }

    public MarkAllColumn(column: number) {
        let fruits: Array<Fruit> = new Array();
        for (let x of this.board.getColumn(column)) {
            fruits.push(x);
            x.isMatched = true;
        }
        return fruits;
    }

    public MarkAllArea(fruit: Fruit) {
        let fruits: Array<Fruit> = new Array();
        for (let x of this.board.getArea(fruit.position2D)) {
            fruits.push(x);
            x.isMatched = true;
        }
        return fruits;
    }

    public MarkAllSameType(fruit1: Fruit, fruit2: Fruit) {
        let fruits: Array<Fruit> = new Array();

        for (let i of [fruit1, fruit2]) {
            if (i.typeFruit == TypeFruit.RAINBOW) {
                fruits.push(i);
                i.isMatched = true;
            } else {
                for (let x of this.board.getColor(i.typeFruit)) {
                    fruits.push(x);
                    x.isMatched = true;
                }
            }
        }
        return fruits;
    }
}

export interface InterfaceMatchMachine extends MatchMachine { }

export class GroupOfFruit {
    typeTile: TypeFruit;
    tileCluster: Fruit[];
    constructor(typeTile: TypeFruit, tiles: Fruit[]) {
        this.typeTile = typeTile;
        this.tileCluster = tiles;
    }
}





type Point2D = { x: number, y: number };
type PatternConfig = { pattern: number[][], name: string };

function detectPattern(points: Point2D[]): string {
  const patterns: PatternConfig[] = [
    {
      pattern: [
        [ 0, 1, 0 ],
        [ 1, 1, 1 ],
        [ 0, 1, 0 ]
      ],
      name: "Plus shape"
    },
    {
      pattern: [
        [ 0, 1, 0 ],
        [ 0, 1, 0 ],
        [ 0, 1, 0 ]
      ],
      name: "Line shape"
    },
    {
      pattern: [
        [ 1, 1 ],
        [ 1, 1 ]
      ],
      name: "Square shape"
    },
    {
      pattern: [
        [ 0, 1, 0 ],
        [ 1, 1, 1 ],
        [ 0, 1, 0 ]
      ],
      name: "Cross shape"
    }
  ];

  const minX = Math.min(...points.map(point => point.x));
  const minY = Math.min(...points.map(point => point.y));

  const patternWidth = patterns[0].pattern[0].length;
  const patternHeight = patterns[0].pattern.length;

  for (const { pattern, name } of patterns) {
    for (let i = 0; i <= points.length - patternHeight; i++) {
      for (let j = 0; j <= points[0].x - minX - patternWidth; j++) {
        let isPatternMatched = true;

        for (let k = 0; k < patternHeight; k++) {
          for (let l = 0; l < patternWidth; l++) {
            const currentPoint = points.find(point => point.x === minX + j + l && point.y === minY + i + k);

            if ((pattern[k][l] === 1 && !currentPoint) || (pattern[k][l] === 0 && currentPoint)) {
              isPatternMatched = false;
              break;
            }
          }

          if (!isPatternMatched) {
            break;
          }
        }

        if (isPatternMatched) {
          return name;
        }
      }
    }
  }

  return "Unknown shape";
}
