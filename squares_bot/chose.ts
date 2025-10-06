import { cloneWithStructuredClone, Player, renderBoard } from "../general_utils/utils";
import { Board } from "../squares_game/board";
import {GameManager} from "../squares_game/gameManager";
import { Move } from "../squares_game/Move";
import { Color } from "../squares_game/Tile";

/**
 * AI to calculate stats and give best possible turns to play
 * 
 * How to setup:
 *  * Instantiate and pass gamemanager reference
 *  * Play rounds using .playRound, which will return best possible turn
 */
export class Chosé {
    expectedTurns:number
    calculatedTurns:number
    ownGame:GameManager
    board:Board

    public config = {
        
    }

    constructor(gameManager:GameManager) {
        this.ownGame=gameManager
        this.board = this.ownGame.getBoard();
        this.expectedTurns = Math.pow(4,this.ownGame.getBoard().freeTiles)/2
        this.calculatedTurns = 0;
    }
    private p1wins = 0;
    private p2wins =0;

    public possibleMovesCount:number=0;
    public winDistribution:number=0;
    public winningPlayer:Player;
    /**
     * public interface to play round, after each of these plays, you will be given the best optimal play, if exists
     * 
     * very resource hungry at larger grids (4x4 +)
     * @returns best optimal play or undefined when unwinnable
     */
    public playRound(move: Move, defaultDepth = 15): Move | undefined {
        this.ownGame.playMove(move);
        this.calculatedTurns,this.possibleMovesCount,this.p1wins,this.winDistribution,this.p2wins = 0;
        this.expectedTurns = Math.pow(4,this.ownGame.getBoard().freeTiles)/3
        return this.evaluate(move,defaultDepth)?.move;
    }

    
    /**
     * 
     * @param move 
     * @param depth 
     * @returns 
     */
    private runThroughAndAwardChildren(move: ChainedMove, depth: number) {
        this.calculatedTurns++;
        this.possibleMovesCount++;
      if (this.calculatedTurns % Math.round(this.expectedTurns / Math.pow(10,this.board.boardSize)) === 0) {
    console.log(`progress... ${(this.calculatedTurns / this.expectedTurns * 100).toFixed(2)}%`);
}
        if (depth == 0) {
            return;
        }
        
        let children: Move[] = this.ownGame.generateAllValidMoves(this.board)
        
        if (children.length == 0) {
            //we ended and latest move was first player 
            if (move.playedBy==Player.first) {
                move.status = 1
                this.p1wins++;
            } else {
                move.status = -1
                  this.p2wins++;
            }
           // console.log(`${move.playedBy==Player.first ? "First player won (1)" : "Second player won (-1)"}`);
       
            return;
        }

        //inherit
        let min: number = 1
        let max: number = -1
        children.forEach((child) => {
            let childChain = new ChainedMove(child,move.playedBy==Player.first ? Player.second : Player.first,move,0);
            move.childMoves.push(childChain);
            /**
             * recursively simulate turns
             */
            //console.log(`Chosé is playing turn x:${child.x}|y:${child.y}|c:${child.color} player:${childChain.playedBy}`);
            this.ownGame.playMove(child);
            //renderBoard(this.ownGame);
            this.runThroughAndAwardChildren(childChain, depth - 1);
            this.ownGame.undoLastMove();
            //console.log(`Chosé is un-doing turn x:${child.x}|y:${child.y}|c:${child.color}`);
           
           //renderBoard(this.ownGame);

            max = Math.max(childChain.status, max);
            min = Math.min(childChain.status, min);
            /*console.log(`${childChain.playedBy==Player.first
                 ? `Current round is played by first player thus taking maximum of the values below value:${max}`
                  : `Current round is played by first player thus taking maximum of the values below value:${min}`}`);
*/
            

            });
            //after all the children were played we calculate whether at our
            //the first player plays, so take the highest
            if (move.playedBy==Player.second) {
                move.status = max;
            }
            //the second player plays, so take the lowest
            if (move.playedBy==Player.first) {
                move.status = min
            }

            
         

            //depth--;
      
        
            
    }




    



    trailLocked:number = 0;
   private evaluate(move: Move, defaultDepth=15): ChainedMove | undefined {
    let toret: ChainedMove | undefined = new ChainedMove(
        move,
        this.ownGame.getCurrentPlayer() == Player.first ? Player.second : Player.first,
        undefined,
        0
    );

    this.runThroughAndAwardChildren(toret, defaultDepth);

    this.winDistribution = this.p1wins / (this.p1wins + this.p2wins);
    let p = this.ownGame.getCurrentPlayer();
    let rootEval = toret.status;

    this.winningPlayer = rootEval == 1 ? Player.first : Player.second;

    if (p == Player.first) {
        if (rootEval == 1) {
            for (const child of toret.childMoves) {
                if (child.status === 1) {
                    return child;
                }
            }
        } else {
            return undefined;
        }
    }
    else {
        if (rootEval == -1) {
            for (const child of toret.childMoves) {
                if (child.status === -1) {
                    return child;
                }
            }
        } else {
            return undefined;
        }
    }
    return undefined; 
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