class GameBoard {
    constructor (scene) {
        this.scene = scene;
        this.tiles = [];
        this.pieces = [];
        this.auxBoard = [];

        this.initTiles();
        this.initPieces();

        console.log(this.tiles);

    }

    initTiles() {
        console.log("ARRAY")
        console.log(this.tiles);
        for (let i = 0; i < 5; i++) {
            let line = []; 
            for (let j = 0; j < 5; j++) {
                let tile;
                if (i % 2 == j % 2) {
                    tile = new Tile(this.scene, 'Black', null);
                } 
                else {
                    tile = new Tile(this.scene, 'White', null);
                }
                line.push(tile);
            }
            this.tiles.push(line);
        }
        console.log(this.tiles);

    }

    initPieces() {
        for (let i = 0; i < 5; i++) {
            if (i % 2 == 0) {
                let piece1 = new Piece(10 + i, this.scene, null, 'White', this.tiles[0][i]);
                this.tiles[0][i].setPiece(piece1);

                let piece2 = new Piece(20 + i, this.scene, null, 'White', this.tiles[4][i]);
                this.tiles[4][i].setPiece(piece2);
                this.pieces.push(piece1, piece2);
            }
            else {
                let piece1 = new Piece(10 + i, this.scene, null, 'Black', this.tiles[0][i]);
                this.tiles[0][i].setPiece(piece1);
                
                let piece2 = new Piece(20 + i, this.scene, null, 'Black', this.tiles[4][i]);
                this.tiles[4][i].setPiece(piece2);
                this.pieces.push(piece1, piece2);
            }
        }
    }

    display() {
        this.scene.pushMatrix()
        this.scene.translate(0,0.2,0)
        this.scene.rotate(-Math.PI / 2, 1,0,0)
        for (let i = 0; i < 5; i++){
            for (let j = 0; j < 5; j++) {
                this.scene.pushMatrix()
                this.scene.translate(j * 5, i * 5, 0)
                this.tiles[i][j].display()
                this.scene.popMatrix() 
            }
        }
        this.scene.popMatrix()

    }

}