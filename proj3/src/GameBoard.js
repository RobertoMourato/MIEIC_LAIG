class GameBoard {
    constructor (scene) {
        this.scene = scene;
        this.tiles = [];
        this.pieces = [];
        this.auxBoard = new AuxBoard(this.scene);

        let player1;
        let player2;

        if (this.scene.mode == "Player vs Player") {
            player1 = new Player(5, "Human", "Green")
            player2 = new Player(9, "Human", "Blue")
        }
        else if (this.scene.mode == "Player vs CPU") {
            if (this.scene.bot1Level == "Level1")
                player1 = new Player(5, "CPU", "Green", "Level1")
            else player1 = new Player(5, "CPU", "Green", "Level2")
            player2 = new Player(9, "Human", "Blue")
        }
        else {
            if (this.scene.bot1Level == "Level1")
                player1 = new Player(5, "CPU", "Green", "Level1")
            else player1 = new Player(5, "CPU", "Green", "Level2")

            if (this.scene.bot2Level == "Level1")
                player2 = new Player(5, "CPU", "Green", "Level1")
            else player2 = new Player(5, "CPU", "Green", "Level2")
        }
        this.players = [player1, player2]
        
        this.playerPlaying = this.players[1]

        this.initTiles();
        this.initPieces();


    }

    switchPlayer() {
        if (this.playerPlaying == this.players[0])
            this.playerPlaying = this.players[1]
        else this.playerPlaying = this.players[0]
    }

    initTiles() {
        for (let i = 0; i < 5; i++) {
            let line = []; 
            for (let j = 0; j < 5; j++) {
                let tile
                if (i % 2 == j % 2) {
                    tile = new Tile(i * 10 + j, this.scene, 'Black', null);
                } 
                else {
                    tile = new Tile(i * 10 + j, this.scene, 'White', null);
                }
                line.push(tile);
            }
            this.tiles.push(line);
        }
        console.log(this.tiles)
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

    addPieceToTile(piece, tile) {
        tile.piece = piece
        piece.tile = tile;
    }

    removePieceFromTile(tile) {
        tile.piece.tile = null;
        tile.piece = null;
    }

    movePiece(piece, destTile) {
        this.removePieceFromTile(piece.tile)
        if (destTile.piece != null)
            this.auxBoard.addPiece(destTile.piece)
        this.addPieceToTile(piece, destTile)
    }

    highlightTiles(moves) {
        let tile = ""

        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].picked) {
                tile = this.pieces[i].tile.id
                break
            }
        }

        if (tile === 0 || tile === 1 || tile === 2 || tile === 3 || tile === 4) {
            tile = "0" + tile
        }

        for (let i = 0; i < 5; i++)
            for (let j = 0; j < 5; j++)
                this.tiles[i][j].highlighted = false;

        if (tile != "") {
            let destTiles = moves[tile];
            for (let i = 0; i < destTiles.length; i++){
                let id = parseInt(destTiles[i], 10)
                let line = Math.floor(id / 10);
                let column = id % 10
                this.tiles[line][column].highlighted = true;
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
                this.scene.translate(j * 5, (4 - i) * 5, 0)
                this.tiles[i][j].display()
                this.scene.popMatrix()
            }
        }
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(-10, 0, -2.5)
        this.scene.translate(0, 0.2, 0)
        this.scene.rotate(-Math.PI / 2, 1,0,0)
        this.auxBoard.display()
        this.scene.popMatrix()


    }

}