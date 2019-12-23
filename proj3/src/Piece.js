class Piece {
    constructor(Player, Color, Tile) {
        this.player = Player;
        this.color = Color;
        this.tile = Tile;
        
        if (this.color == this.tile.getColor())
            this.type = 'Bishop';
        else this.type = 'Horse';
    }

    getType() {
        return this.type;
    }

    display() {
        if (this.type == 'Bishop') {


        }
        else if (this.type == 'Horse') {
            

        }
        else {
            alert('Undefined PieceType');
        }
    }



}