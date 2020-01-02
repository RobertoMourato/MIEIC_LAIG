class AuxBoard {
    constructor (scene) {
        this.scene = scene
        this.pieces = [];

        this.shape = new MyRectangle(this.scene, null, -2, 4, 0, 15);
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
        this.shape.display()

        for (let i = 0; i < this.pieces.length; i++) {
            let x = 0;
            if (i > 4)
                x = 2
            this.scene.pushMatrix()
            this.scene.translate(x, i * 2, 0)
            this.pieces[i].display()
            this.scene.popMatrix()
        }
    }
}