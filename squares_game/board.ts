import { Color, Tile } from "./Tile";

export class Board {
    private board: Tile[][] = []
    public boardSize: number = 0
    public freeTiles: number = 0
    constructor(size: number) {
        this.boardSize = size
        this.freeTiles = size * size
        for (let x = 0; x < size; x++) {
            this.board.push([]);
            for (let y = 0; y < size; y++) {
                let tile = new Tile(Color._none);
                this.board[x].push(tile);
            }
        }
    }

    /**
     * 
     * @param x coordinate of x
     * @param y coordinate of y
     * @returns tile at these coordinates, if not valid returns new
     */
    private getTileAt(x: number, y: number): Tile {
        if (x > this.board.length || y > this.board.length || x < 1 || y < 1) {
            return new Tile(Color._none)
        }
        return this.board[x - 1][y - 1]
    }

    /**
     * @returns gets color of specified tile
     */
    public getColorAt(x: number, y: number): Color {
        return this.getTileAt(x, y).getColor();
    }
    /**
     * @param col color to set the tile to
     * @returns none
     */
    public setColorAt(x: number, y: number, col: Color) {
        // console.log(`Setting color: ${col} at x:${x} y:${y}`);
     
        return this.getTileAt(x, y).setColor(col)
    }

    public getFreeTiles():number{
        let ret = 0
         for (let y = 0; y < this.boardSize; y++) {
           
            for (let x = 0; x < this.boardSize; x++) {
                if(this.getTileAt(x,y).getColor()==Color._none){
                    ret++;
                }
            }
        }
        return ret;
    }


    /* public renderBoard() {
          console.log("")
          const colorMap: Record<Color, string> = {
              [Color.red]: "\x1b[41m  \x1b[0m", // red background
              [Color.green]: "\x1b[42m  \x1b[0m", // green background
              [Color.blue]: "\x1b[44m  \x1b[0m", // blue background
              [Color.yellow]: "\x1b[43m  \x1b[0m", // yellow background
              [Color._blocked]: "\x1b[40m  \x1b[0m", // black background
              [Color._none]: "\x1b[47m  \x1b[0m", // white background
              [Color._black]: "\x1b[45m  \x1b[0m",
             
          };
  
          for (let y = 0; y < this.boardSize; y++) {
              let row = "";
              for (let x = 0; x < this.boardSize; x++) {
                  const color = this.board[x][y].getColor();
                  row += colorMap[color] || colorMap[Color._none];
              }
              console.log(row);
          }
          console.log("")
          console.log("\n#######################################\n")
      }*/

    public renderBoard() {
        for (let y = 0; y < this.boardSize; y++) {
            let row = "";
            for (let x = 0; x < this.boardSize; x++) {
                const color = this.board[x][y].getColor();

                let symbol = "";
                switch (color) {
                    case Color.red:
                        symbol = "\x1b[31m[R]\x1b[0m"; // red
                        break;
                    case Color.green:
                        symbol = "\x1b[32m[G]\x1b[0m"; // green
                        break;
                    case Color.blue:
                        symbol = "\x1b[34m[B]\x1b[0m"; // blue
                        break;
                    case Color.yellow:
                        symbol = "\x1b[33m[Y]\x1b[0m"; // yellow
                        break;
                    case Color._blocked:
                        symbol = "\x1b[30m[K]\x1b[0m"; // black
                        break;
                    case Color._none:
                        symbol = "\x1b[37m[0]\x1b[0m"; // white / empty
                        break;
                    case Color._black:
                        symbol = "\x1b[35m[X]\x1b[0m"; // magenta for blocked
                        break;
                    default:
                        symbol = "_";
                }

                row += symbol + " ";
            }
            console.log(row);
        }
        //console.log("\n############################\n")
    }

}

