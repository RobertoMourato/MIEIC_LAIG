class Tile {
    constructor (id, scene, Color) {
        this.id = id
        this.scene = scene;
        this.color =  Color;
        this.piece = null;

        this.shape = new MyRectangle(this.scene, null, -2.5, 2.5, -2.5, 2.5);
        this.initMaterials()
    }   

    initMaterials() {
        this.black = new CGFappearance(this.scene);
        this.black.setAmbient(0.05,0.05,0.05,0.05);
        this.black.setDiffuse(0.0, 0.0, 0.0, 0.0);
        this.black.setSpecular(0.0, 0.0, 0.0, 0.0);
        this.black.setShininess(5.0);

        this.white = new CGFappearance(this.scene);
        this.white.setAmbient(0.2,0.2,0.2,0.2);
        this.white.setDiffuse(0.9, 0.9, 0.9, 0.9);
        this.white.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.white.setShininess(5.0);
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
        this.scene.registerForPick(this.id, this)
        if (this.color == "White") {
            this.white.apply()
            this.shape.display();
        } else if (this.color == "Black") {
            this.black.apply()
            this.shape.display();
        } else {
            alert("Undefined Tile Type");
        }
        this.scene.clearPickRegistration()

        this.scene.setDefaultAppearance();

        if (this.piece != null)
            this.piece.display()


    }

}