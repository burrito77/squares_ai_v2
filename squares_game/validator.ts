import { Board } from "./board";

import { Navigator } from "./navigator";
import { Color } from "./Tile";

export class Validator {
    game: Board;
    private navigator: Navigator
    constructor(game: Board) {
        this.game = game;
        this.navigator = new Navigator(game);
    }

    /**
     * will calculate if its possible to place, and generates blocked tiles if so
     * @param color color to place
     * @param x x coordinate where to place
     * @param y y coordinate where to place
     * @returns boolean if tile has been placed
     */
    public isValid(color: Color, x: number, y: number): boolean {

        let us = this.game.getColorAt(x, y);
        if (us !== Color._none) {
            return false;
        }

        let top = this.navigator.getTopNeighbourColor(x, y);
        let bot = this.navigator.getBottomNeighbourColor(x, y);
        let right = this.navigator.getRightNeighbourColor(x, y);
        let left = this.navigator.getLeftNeighbourColor(x, y);
        
        if (this.selfColors_explicit(top, color) || this.selfColors_explicit(bot, color) || this.selfColors_explicit(right, color) || this.selfColors_explicit(left, color)) {
            return false;
        }



        let result = this.friendlyColors(top, color) && this.friendlyColors(bot, color) && this.friendlyColors(right, color) && this.friendlyColors(left, color)
        if (result) {
            return true;
        } else {
            return false;
        }

    }

    /**
     * for now we will just run isValid for each and if not block the square
     * in future hopefully i'l care enough to do this just locally
     */

    public setTurnEffects(color: Color, x: number, y: number) {
        for (let i = 1; i < this.game.boardSize + 1; i++) {
            for (let j = 1; j < this.game.boardSize + 1; j++) {
                if (!this.isValid(Color.red, j, i) && !this.isValid(Color.blue, j, i) && !this.isValid(Color.yellow, j, i) && !this.isValid(Color.green, j, i) && this.game.getColorAt(j, i) === Color._none) {
                    this.game.setColorAt(j, i, Color._blocked)
                }
            }
        }
    }

    public removeTurnEffects(x:number, y:number){
        for (let i = 1; i < this.game.boardSize + 1; i++) {
            for (let j = 1; j < this.game.boardSize + 1; j++) {
                if ((this.isValid(Color.red, j, i) || this.isValid(Color.blue, j, i) || this.isValid(Color.yellow, j, i) || this.isValid(Color.green, j, i)) && this.game.getColorAt(j, i) === Color._blocked) {
                    this.game.setColorAt(j, i, Color._none)
                }
            }
        }
    }
   


    /**
     * 
     * @param color1 
     * @param color2 
     * @returns whether can these two colors be next to each other side
     */
    private friendlyColors(color1: Color, color2: Color): boolean {
        return !(color1 * color2 === 5 || color1 * color2 === 7 || color1 * color2 === 10 || color1 * color2 === 14)
    }
    /**
     * whether these colors are the same (does interact with none,black,blocked either, so it resolves as same)
     * @param color1 
     * @param color2 
     * @returns 
     */
    private selfColors(color1: Color, color2: Color): boolean {
        return (color1 * color2 === 1 || color1 * color2 === 4 || color1 * color2 === 25 || color1 * color2 === 49 || color1 * color2 <= 0)
    }

    private selfColors_explicit(color1: Color, color2: Color): boolean {
        return (color1 * color2 === 1 || color1 * color2 === 4 || color1 * color2 === 25 || color1 * color2 === 49)
    }


}

function v(s: string) {
    console.log(s)
}

