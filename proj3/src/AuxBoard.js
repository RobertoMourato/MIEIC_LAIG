class AuxBoard {
    constructor (scene) {
        this.scene = scene
        this.pieces = [];

        this.shape = new MyRectangle(this.scene, null, 0, 6, 0, 15);
    }

    addPiece(piece) {
        this.pieces.push(piece);
        piece.tile = null
    }

    removePiece(piece) {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i] == piece) {
                this.pieces.splice(i, 1)
                break
            } 
        }
    }

    display() {
        this.scene.graph.gameElements.displayAuxBoard()

        for (let i = 0; i < this.pieces.length; i++) {
            let x = Math.floor(i / 4) * 2.5;
            let y = i % 4 * 3 + 2
            this.scene.pushMatrix()
            this.scene.translate(x, y , 0)
            this.pieces[i].display()
            this.scene.popMatrix()
        }
    }
}