class GameBoard {
    constructor () {
        this.tiles = [];
        this.pieces = [];
        this.auxBoard = [];

        this.initTiles()
        this.initPieces()


    }

    initTiles() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (i % 2 == j % 2) {
                    this.tiles[i][j] = new Tile('Black', null);
                } 
                else {
                    this.tiles[i][j] = new Tile('White', null);
                }
            }
        }
    }

    initPieces() {       

        for (let i = 0; i < 5; i++) {
            if (i % 2 == 0) {
                let piece1 = new Piece(null, 'White', this.tiles[0][i]);
                this.tiles[0][i].setPiece(piece1);

                let piece2 = new Piece(null, 'White', this.tiles[4][i]);
                this.tiles[4][i].setPiece(piece2);
                this.pieces.push(piece1, piece2);
            }
            else {
                let piece1 = new Piece(null, 'Black', this.tiles[0][i]);
                this.tiles[0][i].setPiece(piece1);
                
                let piece2 = new Piece(null, 'Black', this.tiles[4][i]);
                this.tiles[4][i].setPiece(piece2);
                this.pieces.push(piece1, piece2);
            }
        }
    }

    display() {
        
    }

}