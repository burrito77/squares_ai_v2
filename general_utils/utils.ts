import { Board } from "../squares_game/board";
import { GameManager } from "../squares_game/gameManager";
import { Color } from "../squares_game/Tile";
/*export function gameToUSN(game:Game):string{
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
*/
export enum Player{
    first = 1,
    second = 2
}
export function getInverseColor(c:Color):Color{
    if(c===Color._black)return Color._none
    if(c===Color._blocked)return Color._none
    if(c===Color._none)return Color._blocked
    if(c>0)return Color._none;
}

export function renderBoard(g:GameManager){
    g.getBoard().renderBoard();
}

const enableLogs = true;
export function log(s:string){
    if(!enableLogs){return;}
    console.log(s);
}

export function cloneWithStructuredClone<T>(instance: T, ctor: new (...args: any[]) => T): T {
    // Deep clone the instance’s own properties
    const clonedProps = structuredClone(instance);

    // Create a new instance using the class constructor
    const newInstance = Object.create(ctor.prototype) as T;

    // Assign all cloned properties to the new instance
    Object.assign(newInstance, clonedProps);

    return newInstance;
}
