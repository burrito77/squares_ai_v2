import { Board } from "../squares_game/board";
import {Game} from "../squares_game/game"
import { Color } from "../squares_game/Tile";
export function gameToUSN(game:Game):string{
    let ret:string = "";
    let colorMap: Record<Color, string> = {
        [Color.red]: "R",
        [Color._none]: "0",
        [Color._blocked]: "X",
        [Color._black]: "K",
        [Color.green]: "G",
        [Color.blue]: "B",
        [Color.yellow]: "Y"
    };

    let p:number = game.startingPlayer%2 + 1;
    let b:Board = game.game;
    for(let x = 0; x < b.boardSize; x++){
        for(let y = 0; y < b.boardSize; y++){
        ret+=colorMap[b.getColorAt(y,x)]
    }
    }
    ret+=p.toString();
    return ret;
    }