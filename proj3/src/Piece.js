class Piece {
    constructor(id, scene, player, color, tile) {
        
        this.id = id
        this.scene = scene;
        this.player = player;
        this.color = color;
        this.tile = tile;

        this.picked = false;

        this.shape = new MyCylinder(scene, 20, 10, 1, 1, 1);
        
        if (this.color == this.tile.getColor())
            this.type = 'Bishop';
        else this.type = 'Horse';
    }

    getType() {
        return this.type;
    }

    getTile() {
        return this.tile;
    }

    setTile(tile) {
        this.tile = tile;

        if (this.color == this.tile.getColor())
            this.type = 'Bishop';
        else this.type = 'Horse';
        
        return this.tile;
    }

    setPicked(t) {
        this.picked = t
    }
    togglePicked() {
        this.picked = !this.picked
    }

    display() {
        this.scene.registerForPick(this.id, this)
        if (this.type == 'Bishop') {
            this.scene.pushMatrix()

            if (this.picked == true)
                this.scene.translate(0,0,1)

            this.shape.display()
            this.scene.popMatrix()
        }
        else if (this.type == 'Horse') {            
            this.scene.pushMatrix()

            if (this.picked == true)
                this.scene.translate(0,0,1);

            this.shape.display()
            this.scene.popMatrix()
        }
        else {
            alert('Undefined Piece Type');
        }
        this.scene.clearPickRegistration()
    }
}