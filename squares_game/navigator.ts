import { Board } from "./board";
import { Color, Tile } from "./Tile";

export class Navigator{
    board:Board
    cursor:{x:number,y:number}
    constructor(board:Board){
        this.board = board;
        this.cursor = {x:0,y:0}
    }



    /**
     * 
     * @param x 
     * @param y 
     * @returns all of these return NONE color if neighbour is not existent
     */
    getTopNeighbourColor(x:number,y:number):Color{
   
        return this.board.getColorAt(x,y-1)
    }
      /**
     * 
     * @param x 
     * @param y 
     * @returns all of these return NONE color if neighbour is not existent
     */
    getBottomNeighbourColor(x:number,y:number):Color{
     
        return this.board.getColorAt(x,y+1)
    }
      /**
     * 
     * @param x 
     * @param y 
     * @returns all of these return NONE color if neighbour is not existent
     */
    getLeftNeighbourColor(x:number,y:number):Color{
       
        return this.board.getColorAt(x-1,y)
    }
      /**
     * 
     * @param x 
     * @param y 
     * @returns all of these return NONE color if neighbour is not existent
     */
    getRightNeighbourColor(x:number,y:number):Color{
       
        return this.board.getColorAt(x+1,y)
    }


}