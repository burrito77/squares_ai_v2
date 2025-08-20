/**
 * this ai should optimally take higher and higher win chance move until reacgin 100%, fragmentization is welcome
 * 
 * 
 * fragmentization: the more secluded and fragmentized tiles are, the better the ai can think to future and also have prepared path when it realizes the winning move
 * stable turns: in 5x5 first player always wants to block odd amount of tiles, whereas second one wants to block even
 * win chance: after reaching optimal number of turns just cut of those, that have many answers
 * 
 */

import { Board } from "../squares_game/board";
import { Game } from "../squares_game/game";
import { Color } from "../squares_game/Tile";
import { Validator } from "../squares_game/validator";

import { Move } from "./types";

export class Chosé {
    board: Board = new Board(0)
    currentlyPlaying:boolean = false
    validator: Validator = new Validator(this.board)
    futureValidator = new Validator(this.copyBoard(this.board))
    Preference_firstplayer = true;
    constructor() {

    }
    /**
     * load custom game, if params empty will create new one
     * @param USN universal square notation
     * @param game_ref reference to the game
     */
    public loadGame(USN?: string, game_ref?: Game) {

        if (game_ref) {
            this.buildGame(game_ref);
            console.log("game builded...")
        }
        if (USN) {
            this.buildGame_(USN);
        }
        this.futureValidator = new Validator(this.copyBoard(this.board))
    }

    /**
     * public interface to play round, after each of these plays, you will be given the best optimal play, if exists
     *
     */
    public playRound(move: Move, defaultDepth = 4): Move | undefined {
        this.executeMove(move);
        this.changePlayer();
        return this.getNextBestMove(move,defaultDepth);
    }

    /**
     * get best valued move at current position from current player pov
     */
    //public getNextBestMove():Move{}

 

    private changePlayer(){
        this.currentlyPlaying = !this.currentlyPlaying
    }


    //TODO the generation seems pretty sketchy, for some reason, it purposfuly skips many variants, to see which, just print at the end or floor
    //TODO even if we ignore this, for some reason the score information cannot get to output, the children are
    //TODO and there are much many more children than there should be

    private runThroughAndAwardChildren(move: Move, depth: number, currentlyPlaying:boolean) {
        if (depth == 0) {
            let tiles_num = this.futureValidator.game.getFreeTiles()
            let tiles_even = tiles_num%2==0
            if(tiles_even&&currentlyPlaying){
                move.status=-1;
            }
            if(!tiles_even&&currentlyPlaying){
                move.status=1
            }
             if(!tiles_even&&!currentlyPlaying){
                move.status=-1
            }
            if(tiles_even&&!currentlyPlaying){
                move.status=1
            }
            this.futureValidator.game.renderBoard();
            return;
        }
        this.changePlayer()
        let children: Move[] = this.generateAllValidMoves(this.futureValidator.game)

        if (children.length == 0) {
            //we ended
            if (!currentlyPlaying) {
                move.status = 1
            } else {
                move.status = -1
            }
            return;
        }
        let min: number = 1
        let max: number = -1
        children.forEach((child) => {

            /**
             * recursively simulate turns
             */
            this.executeMove(move)
            this.runThroughAndAwardChildren(child, depth - 1,currentlyPlaying);
            this.moveBack(move);
            this.changePlayer()

            max = Math.max(child.status, max);
            min = Math.min(child.status, min);
            //the first player plays, so take the highest
            if (!currentlyPlaying) {
                move.status = max;
            }
            //the second player plays, so take the lowest
            if (currentlyPlaying) {
                move.status = min
            }

            //if child is good for player 1 then add him to next move
            if (child.status == 1 && !currentlyPlaying) {
                move.childrMoves.push(child);
            }

            //if child is good for player 2 then add him to next move
            if (child.status == -1 && currentlyPlaying) {
                move.childrMoves.push(child);
            }
        })
        

    }









    /**
     *  because im not that smart i will write it here
     *  for every move there will be N more moves
     *  each of these moves will be evaluated and probably sorted which is better and then part of these N will be eliminated
     * 
     *  okay another approach: winning decisions will be awarded +1 and losing -1, so we will have to go sideways through the decision tree
     *  if decision above is our -1 & 1 will be -1 because it winning does not depend on us
     *  if decision above is their -1 & 1 will be 1 because it does imply we can choose how it ends
     *  !!so basically 1 + (-1) = their min or max depending who plays
     *  now its important to create that tree of decision to be able to see as furtherst away, and use optimalization during this
     *      */
    private getNextBestMove(move: Move,defaultDepth=4): Move | undefined {
        
        this.runThroughAndAwardChildren(move, defaultDepth,this.currentlyPlaying);
        let toret:Move|undefined = undefined;
    
        //after this move is populated by score
        //as long as one's are taken you cannot lose
        move.childrMoves.forEach((move_child) => {
           
         if(!this.currentlyPlaying){
            if(move_child.status==1){
                toret = move_child;
            }
         }else{
             if(move_child.status==-1){
                toret = move_child;
            }
         }
        

        })
       return toret;
    }



    /**
     * generetae ALL valid moves (at the current round) for the board provided
     * @param board 
     * @returns 
     */
    private generateAllValidMoves(board: Board): Move[] {
        let ret: Move[] = []
        for (let y = 1; y < board.boardSize + 1; y++) {
            for (let x = 1; x < board.boardSize + 1; x++) {
                ret.push(...this.getColorVariantsOfAMove(x, y))
            }
        }
        return ret.filter((move) => { return this.isValidMove(move) })
    }


    private getColorVariantsOfAMove(x: number, y: number): Move[] {
        return [
            { x: x, y: y, color: Color.red, childrMoves: [], status: 0, previousMove: undefined },
            { x: x, y: y, color: Color.green, childrMoves: [], status: 0, previousMove: undefined },
            { x: x, y: y, color: Color.blue, childrMoves: [], status: 0, previousMove: undefined },
            { x: x, y: y, color: Color.yellow, childrMoves: [], status: 0, previousMove: undefined }
        ]
    }

    private isValidMove(move: Move): Boolean {
        if (this.futureValidator.isValid(move.color, move.x, move.y)) {
            return true;
        }
    }
    private executeMove(move: Move) {
        //play the playable moves
        this.futureValidator.game.setColorAt(move.x, move.y, move.color);
        this.futureValidator.setTurnEffects(move.color, move.x, move.y);
    }
    private moveBack(move: Move) {
        //remove the play
        this.futureValidator.game.setColorAt(move.x, move.y, Color._none);
        this.futureValidator.removeTurnEffects(move.x, move.y);
    }



    /**
     * build game from reference
     * @param game_ref 
     */
    private buildGame(game_ref: Game) {
        let b = new Board(game_ref.game.boardSize);
        for (let y = 1; y < game_ref.game.boardSize + 1; y++) {
            for (let x = 1; x < game_ref.game.boardSize + 1; x++) {
                b.setColorAt(x, y, game_ref.game.getColorAt(x, y))
            }
        }
        this.currentlyPlaying = game_ref.startingPlayer==1;
        this.board = b;
        this.validator = new Validator(this.board);
    }

    private buildGame_(USN: string) {
        //hell naw
    }

    private copyBoard(board: Board): Board {
        let b = new Board(board.boardSize);
        for (let y = 1; y < board.boardSize + 1; y++) {
            for (let x = 1; x < board.boardSize + 1; x++) {
                b.setColorAt(x, y, board.getColorAt(x, y))
            }
        }
        return b
    }

    private modifyBoard(board: Board, moves: Move[]): Board {
        let b = this.copyBoard(board);
        moves.forEach((move: Move) => {
            b.setColorAt(move.x, move.y, move.color);
        })
        return b;
    }



}