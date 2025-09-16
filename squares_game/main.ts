import * as readline from "readline";
//import {Chosé} from "../squares_bot/chose"
import { Board } from "./board";
import { Color } from "./Tile";
import { GameManager } from "./gameManager";
import { Move } from "./Move";
import { renderBoard } from "../general_utils/utils";
import {Chosé} from "../squares_bot/chose";
let game = new GameManager(new Board(5));
let cheater = new Chosé(game);
//cheater.loadGame(undefined,game);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askMove() {
    rl.question("Enter move (x y color[r/g/b/y]): ", (answer) => {
        let [xs, ys, cs, ct] = answer.trim().split(/\s+/);
        let x = parseInt(xs, 10);
        let y = parseInt(ys, 10);
        let c = cs
        
            
           
        // map input 1-4 to Color
        let colorMap: Record<string, Color> = {
            r: Color.red,
            g: Color.green,
            b: Color.blue,
            y: Color.yellow
        };

        if (isNaN(x) || isNaN(y)) {
            console.log("Invalid input. Format: x y color(r-y)");
        } else {
            console.log("#############")
            game.playMove(new Move(x,y,colorMap[c]));
            renderBoard(game);
            console.log("##############")
            console.log("Now playing: PLAYER "+(game.getCurrentPlayer()))
            //cheats here
            let move:Move|undefined = cheater.playRound(new Move(x,y,colorMap[c]),8)
           
           if(move!==undefined){
                console.log(`Optimální odpověď na tento tah by mělo být ${move.x} ${move.y} ${move.color}`)
           }else{
                console.log(`Zatím nelze vyhrát, zkus čekat než oponent udělá chybu`)
           }
        }

        askMove(); // keep looping
        
    });
}




askMove();
