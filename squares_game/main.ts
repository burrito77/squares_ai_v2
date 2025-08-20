import * as readline from "readline";
import {Chosé} from "../squares_bot/chose"
import { Board } from "./board";
import { Game } from "./game";
import { Color } from "./Tile";
import { Move } from "../squares_bot/types";
let game = new Game(new Board(3));
let cheater = new Chosé();
cheater.loadGame(undefined,game);
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
            game.playNext(colorMap[c], x, y);
            console.log("##############")
            console.log("Now playing: PLAYER "+(game.startingPlayer%2 + 1))
            //cheats here
           let move:Move|undefined = cheater.playRound({x:x,y:y,color:colorMap[c],previousMove:undefined,childrMoves:[],status:0},8)
           
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
