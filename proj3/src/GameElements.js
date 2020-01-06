class GameElements {
    constructor(scenegraph) {
        this.scenegraph = scenegraph
        this.blackTile;
        this.whiteTile;
        this.auxBoard;
        this.horsePiece;
        this.bishopPiece;
    }

    displayBlackTile() {
        this.scenegraph.displayComponent(this.blackTile)
    }
    displayWhiteTile() {
        this.scenegraph.displayComponent(this.whiteTile)
    }
    displayAuxBoard() {
        this.scenegraph.displayComponent(this.auxBoard)
    }
    displayHorsePiece() {
        this.scenegraph.displayComponent(this.horsePiece)
    }
    displayBishopPiece() {
        this.scenegraph.displayComponent(this.bishopPiece)
    }
}