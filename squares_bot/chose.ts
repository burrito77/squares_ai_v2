/**
 * this ai should optimally take higher and higher win chance move until reacgin 100%, fragmentization is welcome
 * 
 * 
 * fragmentization: the more secluded and fragmentized tiles are, the better the ai can think to future and also have prepared path when it realizes the winning move
 * stable turns: in 5x5 first player always wants to block odd amount of tiles, whereas second one wants to block even
 * win chance: after reaching optimal number of turns just cut of those, that have many answers
 * 
 */
import { cloneWithStructuredClone, Player } from "../general_utils/utils";
import { Board } from "../squares_game/board";
import {GameManager} from "../squares_game/gameManager";
import { Move } from "../squares_game/Move";
import { Color } from "../squares_game/Tile";


export class Chosé {
    ownGame:GameManager
    board:Board
    constructor(gameManager:GameManager) {
        
        let copy:GameManager =cloneWithStructuredClone(gameManager,GameManager)
        this.ownGame=copy
        this.board = copy.getBoard();
    }
   

    /**
     * public interface to play round, after each of these plays, you will be given the best optimal play, if exists
     *
     */
    public playRound(move: Move, defaultDepth = 4): Move | undefined {
        this.ownGame.playMove(move);
        return this.getNextBestMove(move,defaultDepth)?.move;
    }

    //TODO the generation seems pretty sketchy, for some reason, it purposfuly skips many variants, to see which, just print at the end or floor
    //TODO even if we ignore this, for some reason the score information cannot get to output, the children are
    //TODO and there are much many more children than there should be

    private runThroughAndAwardChildren(move: ChainedMove, depth: number) {
        if (depth == 0) {
            let tiles_num = this.board.getFreeTiles();
            let tiles_even = tiles_num%2==0
            if(tiles_even&&move.playedBy==Player.second){
                move.status=-1;
            }
            if(!tiles_even&&move.playedBy==Player.first){
                move.status=1
            }
             if(!tiles_even&&move.playedBy==Player.second){
                move.status=-1
            }
            if(tiles_even&&move.playedBy==Player.first){
                move.status=1
            }
            //this.futureValidator.game.renderBoard();
            return;
        }
        
        let children: Move[] = this.ownGame.generateAllValidMoves(this.board)
        
        if (children.length == 0) {
            //we ended and latest move was first player 
            if (move.playedBy==Player.first) {
                move.status = 1
            } else {
                move.status = -1
            }
            return;
        }
        let min: number = 1
        let max: number = -1
        children.forEach((child) => {
            let childChain = new ChainedMove(child,move.playedBy==Player.first ? Player.second : Player.second,move,0);
            /**
             * recursively simulate turns
             */
            this.ownGame.playMove(child);
            this.runThroughAndAwardChildren(childChain, depth - 1);
            this.ownGame.undoLastMove();
            

            max = Math.max(childChain.status, max);
            min = Math.min(childChain.status, min);
            //the first player plays, so take the highest
            if (childChain.playedBy==Player.first) {
                move.status = max;
            }
            //the second player plays, so take the lowest
            if (childChain.playedBy==Player.second) {
                move.status = min
            }

            //if child is good for player 1 then add him to next move
            if (childChain.status == 1 && childChain.playedBy==Player.first) {
                move.childMoves.push(childChain);
            }

            //if child is good for player 2 then add him to next move
            if (childChain.status == -1 && childChain.playedBy==Player.second) {
                move.childMoves.push(childChain);
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
    private getNextBestMove(move: Move,defaultDepth=4): ChainedMove | undefined {
        let toret:ChainedMove|undefined = new ChainedMove(move,this.ownGame.getCurrentPlayer(),undefined,0);
        this.runThroughAndAwardChildren(toret, defaultDepth);
        
        
        //after this move is populated by score
        //as long as one's are taken you cannot lose
        toret.childMoves.forEach((move_child) => {
           
         if(this.ownGame.getCurrentPlayer()){
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



  

   
}

class ChainedMove{
    move:Move;
    playedBy:Player;
    childMoves:ChainedMove[]=[];
    previousMove:ChainedMove|undefined;
    status:number;
    constructor(move:Move,playedBy:Player,previousMove:ChainedMove|undefined,status:number=0){
        this.move=move;
        this.playedBy = playedBy;
        this.previousMove = previousMove;
        this.status=status;
    }
}