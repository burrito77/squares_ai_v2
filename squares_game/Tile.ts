export class Tile{
    private color:Color = Color._none
    constructor(color:Color){
        this.color = color
    }

    setColor(color:Color){
        this.color = color
    }

    getColor():Color{
        return this.color
    }
}

export enum Color{
    _none = 0,
    _blocked = -3,
    _black = -1,


    red = 1,
    green = 2,


    blue = 5,
    yellow = 7,
}