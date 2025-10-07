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
    public playRound(move: Move, defaultDepth = 15,preference:number=0): Move | undefined {
        this.ownGame.playMove(move);
        this.calculatedTurns,this.p1wins,this.winDistribution,this.p2wins = 0;
        this.expectedTurns = Math.pow(4,this.ownGame.getBoard().freeTiles)/3
        return this.evaluate(move,defaultDepth,preference)?.move;
    }

    
    /**
     * 
     * @param parentMove 
     * @param depth 
     * @returns 
     */
    private runThroughAndAwardChildren(parentMove: ChainedMove, depth: number, preference:number) {
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
            if (parentMove.playedBy==Player.first) {
                parentMove.status = 1
                this.p1wins++;
            } else {
                parentMove.status = -1
                  this.p2wins++;
            }
           // console.log(`${move.playedBy==Player.first ? "First player won (1)" : "Second player won (-1)"}`);
       
            return;
        }

        //inherit
        let min: number = 1
        let max: number = -1
        for(const child of children){
            
            let childChain = new ChainedMove(child,parentMove.playedBy==Player.first ? Player.second : Player.first,parentMove,0);

            this.ownGame.playMove(child);
            this.runThroughAndAwardChildren(childChain, depth - 1, preference);
            this.ownGame.undoLastMove();

            max = Math.max(childChain.status, max);
            min = Math.min(childChain.status, min);

            if(preference!=0){
                if(childChain.status==preference){
                    parentMove.childMoves.push(childChain);
                    break;
                }
            }
             parentMove.childMoves.push(childChain);
           /* if(preference !== 0){
                if(parentMove.playedBy==Player.first && max==preference){
                parentMove.childMoves.push(childChain);
                break;
            }
            if(parentMove.playedBy==Player.second && min==preference){
                parentMove.childMoves.push(childChain);
                break;
            }
            } else {
                parentMove.childMoves.push(childChain);
            }*/
        }

            //after all the children were played we calculate whether at our
            //the first player plays, so take the highest
            if (parentMove.playedBy==Player.second) {
                parentMove.status = max;
            }
            //the second player plays, so take the lowest
            if (parentMove.playedBy==Player.first) {
                parentMove.status = min
            }
    }

   private evaluate(move: Move, defaultDepth=15, preference:number): ChainedMove | undefined {
    let toret: ChainedMove | undefined = new ChainedMove(
        move,
        this.ownGame.getCurrentPlayer() == Player.first ? Player.second : Player.first,
        undefined,
        0
    );

    this.runThroughAndAwardChildren(toret, defaultDepth, preference);

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