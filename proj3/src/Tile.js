class Tile {
    constructor (Color, Piece) {
        this.color =  Color;
        this.piece = Piece;

        this.rectangle = 
    }

    getPiece() {
        return this.piece;
    }

    setPiece(piece) {
        this.piece = piece;
    }

    removePiece() {
        let piece = this.piece;
        this.piece = null;

        return piece;
    }

    getColor() {
        return this.color;
    }

    display() {
        
    }

}