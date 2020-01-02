class Piece {
    constructor(id, scene, player, color, tile) {
        
        this.id = id
        this.scene = scene;
        this.player = player;
        this.color = color;
        this.tile = tile;

        this.picked = false;
        this.delta = 0;
        this.animationTime = 0;

        this.shape = new MyCylinder(scene, 20, 10, 1, 1, 1);
        
        if (this.color == this.tile.getColor())
            this.type = 'Bishop';
        else this.type = 'Horse';

        this.green = new CGFappearance(this.scene)
        this.green.setAmbient(0.2,0.2,0.2,0.2);
        this.green.setDiffuse(0.0, 0.9, 0.5, 1);
        this.green.setSpecular(0.1, 0.1, 0.1, 1);
        this.green.setShininess(5.0);

        this.blue = new CGFappearance(this.scene)
        this.blue.setAmbient(0.2,0.2,0.2,0.2);
        this.blue.setDiffuse(0.0, 0.0, 0.9, 1);
        this.blue.setSpecular(0.1, 0.1, 0.1, 1);
        this.blue.setShininess(5.0);
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
        if (t)
            this.animationTime = 0;
    }

    togglePicked() {
        this.picked = !this.picked
        if (this.picked)
            this.animationTime = 0;
        return this.picked
    }

    update(t) {
        if (this.picked) {
            this.animationTime += t
            this.delta = 1 + 0.25 * Math.sin(3*this.animationTime)
        }
    }

    display() {
        if (this.player.color == "Blue")
            this.blue.apply()
        else this.green.apply()

        this.scene.registerForPick(this.id, this)
        if (this.type == 'Bishop') {
            this.scene.pushMatrix()

            if (this.picked == true)
                this.scene.translate(0,0,this.delta)

            this.shape.display()
            this.scene.popMatrix()
        }
        else if (this.type == 'Horse') {            
            this.scene.pushMatrix()

            if (this.picked == true)
                this.scene.translate(0,0,this.delta);

            this.shape.display()
            this.scene.popMatrix()
        }
        else {
            alert('Undefined Piece Type');
        }
        this.scene.clearPickRegistration()

        this.scene.setDefaultAppearance();
    }
}