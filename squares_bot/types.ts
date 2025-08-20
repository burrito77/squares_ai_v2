import { Color } from "../squares_game/Tile"

export type Move = {
    x:number,
    y:number
    color:Color
    byPlayer?:number
    previousMove:Move|undefined
    childrMoves:Move[]
    status:number //1 won, 0 none, -1 lost
}