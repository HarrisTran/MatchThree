import { _decorator, Component, Node } from 'cc';
import { Board } from './Board';
import { areAllElementsSame, DistinctList } from './Util';
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
                                considerFruit.isMatched = true;
                                a.isMatched = true;
                                b.isMatched = true;

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
                                considerFruit.isMatched = true;
                                a.isMatched = true;
                                b.isMatched = true;

                                this.listAllMatch.add(considerFruit);
                                this.listAllMatch.add(a);
                                this.listAllMatch.add(b);
                            }
                        }
                    }
                }
            }
        }

        // const templst = this.listAllMatch.getList();
        // const isSameType : boolean = areAllElementsSame(templst,"typeFruit");
        // const isSameXAxis : boolean = areAllElementsSame(templst.map(o=>o.position2D),"x");
        // const isSameYAxis : boolean = areAllElementsSame(templst.map(o=>o.position2D),"y");
        // if(isSameType && (isSameXAxis || isSameYAxis))
        // {
        //     if(templst.length == 4)
        //     {
        //         if(isSameXAxis){
        //             //return SpecialTypeMatch.BOMB_HORIZONAL;
        //         }else{
        //             //return SpecialTypeMatch.BOMB_VERTICAL;
        //         }
        //     }
        //     else if(templst.length == 5)
        //     {
        //         //return SpecialTypeMatch.RAINBOW;
        //     }
        // }
        
        return this.listAllMatch;
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

    public CheckHorizontal(x: number, y : number): boolean{
        return true;
    }

    public CheckVertical(x: number, y : number): boolean{
        return true;
    }

    public CheckBomb(x: number, y : number): boolean{
        return true;
    }

    public CheckRainbow(x: number, y : number): boolean{
        return true;
    }
}

export interface InterfaceMatchMachine extends MatchMachine {}
export enum SpecialTypeMatch  {
    BOMB_VERTICAL = "bomb-vertical",
    BOMB_HORIZONAL = "bomb-horizontal",
    RAINBOW =  "rainbow"
}

// public get ListAllMatch() {
//     this.listAllMatch.clear();
//     const specialTilesPositions = [];
  
//     for (let i = 0; i < 8; i++) {
//       for (let j = 0; j < 8; j++) {
//         const considerFruit = this.board.AllFruit[i][j];
  
//         if (considerFruit) {
//           // Check matches horizontally (left and right)
//           this.checkMatches(considerFruit, i, j, 1, 0, specialTilesPositions); // Right
//           this.checkMatches(considerFruit, i, j, -1, 0, specialTilesPositions); // Left
  
//           // Check matches vertically (up and down)
//           this.checkMatches(considerFruit, i, j, 0, 1, specialTilesPositions); // Up
//           this.checkMatches(considerFruit, i, j, 0, -1, specialTilesPositions); // Down
//         }
//       }
//     }
  
//     return {matchedFruits: this.listAllMatch, specialTilesPositions};
//   }
  
//   private checkMatches(fruit: Fruit, startRow: number, startCol: number, rowDirection: number, colDirection: number, specialTilesPositions: any[]) {
//     let matchCount = 1;
//     const matchedPositions = [];
  
//     // Check matches in one direction
//     for (let i = 1; i <= 3; i++) {
//       const currentRow = startRow + rowDirection * i;
//       const currentCol = startCol + colDirection * i;
//       if (this.isValidIndex(currentRow, currentCol) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
//         matchCount++;
//         matchedPositions.push({row: currentRow, col: currentCol});
//       } else {
//         break;
//       }
//     }
  
//     // Check matches in the opposite direction
//     for (let i = 1; i <= 3; i++) {
//       const currentRow = startRow - rowDirection * i;
//       const currentCol = startCol - colDirection * i;
//       if (this.isValidIndex(currentRow, currentCol) && fruit.compareTo(this.board.AllFruit[currentRow][currentCol])) {
//         matchCount++;
//         matchedPositions.push({row: currentRow, col: currentCol});
//       } else {
//         break;
//       }
//     }
  
//     // Mark matched fruits if match count is 4 or more
//     if (matchCount >= 4) {
//       for (let i = 0; i < matchCount; i++) {
//         const currentRow = startRow + rowDirection * i;
//         const currentCol = startCol + colDirection * i;
//         this.board.AllFruit[currentRow][currentCol].isMatched = true;
//         this.listAllMatch.add(this.board.AllFruit[currentRow][currentCol]);
//       }
//       specialTilesPositions.push({row: startRow, col: startCol}, ...matchedPositions);
//     }
//   }
  
//   private isValidIndex(row: number, col: number): boolean {
//     return row >= 0 && row < 8 && col >= 0 && col < 8;
//   }
  


















// function checkSpecialCandies(board) {
//     for each row in board:
//         for each column in row:
//             if checkColorBomb(board, row, column):
//                 print("Color Bomb created at:", row, column)
//             elif checkWrappedCandy(board, row, column):
//                 print("Wrapped Candy created at:", row, column)
//             elif checkStripedCandy(board, row, column):
//                 print("Striped Candy created at:", row, column)

// function checkStripedCandy(board, row, column):
//     color = board[row][column]
    
//     // Check horizontally and vertically
//     for direction in ["horizontal", "vertical"]:
//         matchLength = 1
//         for offset in 1 to 3:
//             if direction is "horizontal":
//                 nextColor = board[row][column + offset]
//             else:
//                 nextColor = board[row + offset][column]
                
//             if nextColor == color:
//                 matchLength += 1
                
//         if matchLength == 4:
//             return true
            
//     return false

// function checkWrappedCandy(board, row, column):
//     color = board[row][column]
    
//     patterns = [ [(0,1), (0,2), (1,0), (2,0)], // Horizontal T
//                  [(1,0), (2,0), (0,1), (0,2)], // Reverse horizontal T
//                  [(0,1), (0,2), (1,2), (2,2)], // Vertical T
//                  [(1,0), (2,0), (2,1), (2,2)] ] // Reverse vertical T
    
//     for pattern in patterns:
//         isMatch = true
//         for offset in pattern:
//             newRow, newColumn = row + offset[0], column + offset[1]
//             if board[newRow][newColumn] != color:
//                 isMatch = false
//                 break
            
//         if isMatch:
//             return true
            
//     return false

// function checkColorBomb(board, row, column):
//     color = board[row][column]
    
//     // Check horizontally and vertically
//     for direction in ["horizontal", "vertical"]:
//         matchLength = 1
//         for offset in 1 to 4:
//             if direction is "horizontal":
//                 nextColor = board[row][column + offset]
//             else:
//                 nextColor = board[row + offset][column]
                
//             if nextColor == color:
//                 matchLength += 1
                
//         if matchLength == 5:
//             return true
            
//     return false
// }
