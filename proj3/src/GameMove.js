class GameMove {
    constructor(piece, srcTile, destTile, gameBoard) {
        this.piece = piece
        this.srcTile = srcTile
        this.destTile = destTile
        this.gameBoardState = []

        for (let i = 0; i < 5; i++){
            let line = []
            for (let j = 0; j < 5; j++) {
                let id
                if (gameBoard.tiles[i][j].piece == null)
                    id = 0
                else id = gameBoard.tiles[i][j].piece.id
                line.push(id)
            }
            this.gameBoardState.push(line)
        }
    }

    animate() {

    }
}