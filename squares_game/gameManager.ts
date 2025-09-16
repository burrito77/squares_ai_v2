
import { Board } from "./board";
import { Move } from "./Move";
import { Color, Tile } from "./Tile";
import { Player } from "../general_utils/utils"
export class GameManager{
   private board:Board
   private moves:Move[] = []
   private USN:string
   private cursor:{x:number,y:number}
   private currentPlayer = Player.first
   //TODO all the options fillout
    constructor(board?:Board,startingPlyer:Player=1,USN?:string){
        this.board = board;
        if(!board&&!USN){
            this.board = new Board(5);
        }
        if(USN){
            
        }
        this.cursor = {x:0,y:0}
    }



    /**
     * 
     * @param x 
     * @param y 
     * @returns all of these return NONE color if neighbour is not existent
     */
    private getTopNeighbourColor(x:number,y:number):Color{ 
        return this.board.getColorAt(x,y-1)
    }
      /**
     * 
     * @param x 
     * @param y 
     * @returns all of these return NONE color if neighbour is not existent
     */
    private getBottomNeighbourColor(x:number,y:number):Color{
     
        return this.board.getColorAt(x,y+1)
    }
      /**
     * 
     * @param x 
     * @param y 
     * @returns all of these return NONE color if neighbour is not existent
     */
    private getLeftNeighbourColor(x:number,y:number):Color{
       
        return this.board.getColorAt(x-1,y)
    }
      /**
     * 
     * @param x 
     * @param y 
     * @returns all of these return NONE color if neighbour is not existent
     */
    private getRightNeighbourColor(x:number,y:number):Color{
       
        return this.board.getColorAt(x+1,y)
    }

    /**
     * plays move on board under this manager, returns false if move is not valid, illegal or error occures
     * 
     *
     * adds move to the chain of moves
     */
    public playMove(moveToPlay:Move):boolean{
        if(!this.isValid(moveToPlay.color,moveToPlay.x,moveToPlay.y)){
            return false;
        }else{
            this.board.setColorAt(moveToPlay.x,moveToPlay.y,moveToPlay.color);
            this.setTurnEffects(moveToPlay.color,moveToPlay.x,moveToPlay.y);
            this.moves.push(moveToPlay);
            this.changePlayer();
            return true;
        }
    }
    /**
     * undos last move, removing it from chain of moves
     */
    public undoLastMove():Move{
       this.board.setColorAt(this.getLastMove().x,this.getLastMove().y,Color._none);
       this.removeTurnEffects(this.getLastMove().x,this.getLastMove().y)
       this.changePlayer();
       return this.moves.pop();
    }

    public getLastMove():Move{
        return this.moves[this.moves.length-1];
    }

    public getCurrentPlayer():Player{
        return this.currentPlayer;
    }

    private changePlayer(){
        if(this.currentPlayer==Player.first){
            this.currentPlayer=Player.second;
        }else{
            this.currentPlayer=Player.first;
        }
    }
    /**
     * 
     * @param color1 
     * @param color2 
     * @returns whether can these two colors be next to each other side, including self colors (e.g red and red is invalid)
     */
    // return green and red or blue and yellow
    private friendlyColors(color1: Color, color2: Color): boolean {
        return (color1*color2==2 || color1*color2==35 || color1*color2 <= 0);
    }

    /**
     * whether these colors are the same (comparing with block,black,none resolves to true)
     * @param color1 
     * @param color2 
     * @returns 
     */
    private selfColors(color1: Color, color2: Color): boolean {
        return (color1 * color2 === 1 || color1 * color2 === 4 || color1 * color2 === 25 || color1 * color2 === 49 || color1 * color2 <= 0)
    }

    /**
     * 
     * @param color1 
     * @param color2 
     * @returns whether these colors are the same (!)
     */
    private selfColors_explicit(color1: Color, color2: Color): boolean {
        return (color1 * color2 === 1 || color1 * color2 === 4 || color1 * color2 === 25 || color1 * color2 === 49)
    }

      /**
     * will calculate if its possible to place
     * @param color color to place
     * @param x x coordinate where to place
     * @param y y coordinate where to place
     * @returns boolean if tile can be placed
     */
    private isValid(color: Color, x: number, y: number): boolean {
        //get tile at position to compare
        let us = this.board.getColorAt(x, y);
        //cannot place tile on anything else than none
        if (us !== Color._none) {
            return false;
        }
        //get neighbours
        let top = this.getTopNeighbourColor(x, y);
        let bot = this.getBottomNeighbourColor(x, y);
        let right = this.getRightNeighbourColor(x, y);
        let left = this.getLeftNeighbourColor(x, y);
        
        //is our color next to us? then we cannot place it
        if (this.selfColors_explicit(top, color) || this.selfColors_explicit(bot, color) || this.selfColors_explicit(right, color) || this.selfColors_explicit(left, color)) {
            return false;
        }


        //then compare if there is friendly color
        let result = this.friendlyColors(top, color) && this.friendlyColors(bot, color) && this.friendlyColors(right, color) && this.friendlyColors(left, color)
        if (result) {
            return true;
        } else {
            return false;
        }

    }


    /**
     * fills tiles according to rules across the board after move in parameters was played
     * @param color 
     * @param x 
     * @param y 
     */
    private setTurnEffects(color: Color, x: number, y: number) {
        for (let i = 1; i < this.board.boardSize + 1; i++) {
            for (let j = 1; j < this.board.boardSize + 1; j++) {
                if (!this.isValid(Color.red, j, i) && !this.isValid(Color.blue, j, i) && !this.isValid(Color.yellow, j, i) && !this.isValid(Color.green, j, i) && this.board.getColorAt(j, i) === Color._none) {
                    this.board.setColorAt(j, i, Color._blocked)
                }
            }
        }
    }

    /**
     * removes tiles according to rules across the board after move was revoked
     * @param x 
     * @param y 
     */
    private removeTurnEffects(x:number, y:number){
        for (let i = 1; i < this.board.boardSize + 1; i++) {
            for (let j = 1; j < this.board.boardSize + 1; j++) {
                if ((this.isValid(Color.red, j, i) || this.isValid(Color.blue, j, i) || this.isValid(Color.yellow, j, i) || this.isValid(Color.green, j, i)) && this.board.getColorAt(j, i) === Color._blocked) {
                    this.board.setColorAt(j, i, Color._none)
                }
            }
        }
    }

      /**
     * generetae ALL valid moves (at the current round) for the board provided
     * @param board 
     * @returns 
     */
    public generateAllValidMoves(board: Board): Move[] {
        let ret: Move[] = []
        for (let y = 1; y < board.boardSize + 1; y++) {
            for (let x = 1; x < board.boardSize + 1; x++) {
                ret.push(...this.getColorVariantsOfAMove(x, y))
            }
        }
        return ret.filter((move) => { return this.isValid(move.color,move.x,move.y,) })
    }

     private getColorVariantsOfAMove(x: number, y: number): Move[] {
        return [
            { x: x, y: y, color: Color.red },
            { x: x, y: y, color: Color.green},
            { x: x, y: y, color: Color.blue },
            { x: x, y: y, color: Color.yellow }
        ]
    }

    /**
     * 
     * @returns board under this manager !do not use this to play moves !!!
     */
    public getBoard():Board{
        return this.board;
    }
}