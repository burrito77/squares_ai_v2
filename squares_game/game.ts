import { Board } from "./board";
import { Color } from "./Tile";
import { Validator } from "./validator";

export class Game {

    public game: Board;
    private validator: Validator
    startingPlayer: number = 0
    constructor(game: Board) {
        this.game = game;
        this.validator = new Validator(game)
    }

    /**
     * function to take action from player's turn
     * @param color 
     * @param x 
     * @param y 
     * @returns boolean if turn completed succsfully, changes players
     */
    playNext(color: Color, x: number, y: number): boolean {
        if (this.game.freeTiles <= 0) {
            this.startingPlayer++;
            console.log("Player " + (this.startingPlayer%2 + 1) + " WON");
            return;
        }
   
        if (this.validator.isValid(color, x, y)) {
            this.game.setColorAt(x, y, color);
            this.validator.setTurnEffects(x, y, color)
            this.startingPlayer++;
            this.game.renderBoard()
            
            return true;
        } else {
            return false;
        }
    }


}


