class GameBoard {
    constructor (scene) {
        this.scene = scene;
        this.tiles = [];
        this.pieces = [];
        this.auxBoard = [];

        this.players = [new Player(5), new Player(9)]
        this.playerPlaying = this.players[0]

        this.initTiles();
        this.initPieces();


    }

    initTiles() {
        for (let i = 0; i < 5; i++) {
            let line = []; 
            for (let j = 0; j < 5; j++) {
                let tile;
                if (i % 2 == j % 2) {
                    tile = new Tile(i*10+j, this.scene, 'Black', null);
                } 
                else {
                    tile = new Tile(i*10+j, this.scene, 'White', null);
                }
                line.push(tile);
            }
            this.tiles.push(line);
        }
    }

    initPieces() {
        for (let i = 0; i < 5; i++) {
            if (i % 2 == 0) {
                let piece1 = new Piece(50 + i, this.scene, this.players[0], 'White', this.tiles[0][i]);
                this.tiles[0][i].setPiece(piece1);

                let piece2 = new Piece(90 + i, this.scene, this.players[1], 'White', this.tiles[4][i]);
                this.tiles[4][i].setPiece(piece2);
                this.pieces.push(piece1, piece2);
            }
            else {
                let piece1 = new Piece(50 + i, this.scene, this.players[0], 'Black', this.tiles[0][i]);
                this.tiles[0][i].setPiece(piece1);
                
                let piece2 = new Piece(90 + i, this.scene, this.players[1], 'Black', this.tiles[4][i]);
                this.tiles[4][i].setPiece(piece2);
                this.pieces.push(piece1, piece2);
            }
        }
    }

    update(t) {
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].update(t)
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