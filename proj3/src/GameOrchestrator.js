class GameOrchestrator {
    constructor (scene) {        
        this.scene = scene;
        this.state = "Menu"
        this.gameBoard = new GameBoard(scene)
        this.prologInterface = new PrologInterface(this)

        console.log("BOARD IN STRING")
        this.prologInterface.requestValidMoves(this.gameBoard)
    }

    setState(state) {
        if (state != "Menu" && state != "PickPiece" && state != "PickTile" && state != "Animating" && state != "EndGame")
            alert("Unknown state")

        this.state = state
    }

    initSceneGraph(filename) { 
        this.sceneGraph = new MySceneGraph(filename, this.scene);
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */)
            if (results != null && results.length> 0) { // any results?
                for (var i=0; i< results.length; i++) { 
                    var obj= this.scene.pickResults[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId= this.scene.pickResults[i][1] // get id
                        this.OnObjectSelected(obj, uniqueId);
                    }
                } // clear results
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
    }

    OnObjectSelected(obj, id) {
        if (obj instanceof Piece) {
            if (obj.player == this.gameBoard.playerPlaying) {
                for (let i = 0; i < this.gameBoard.pieces.length; i++) {
                    if (this.gameBoard.pieces[i].id != id)
                    this.gameBoard.pieces[i].setPicked(false);
                }
                let pieceSelected = obj.togglePicked()

                if (pieceSelected)
                    this.state = "PickTile"
                else this.state = "PickPiece"
            }
        }
        else if (obj instanceof Tile) {
            if (this.state == "PickTile") {
                console.log("picked tile with id=" + obj.id)
            }
        }

    }

    update(t) {
        this.gameBoard.update(t)
    }

    display() {
        this.scene.pushMatrix()
        if (this.state != "Menu") {
            this.gameBoard.display()
            this.sceneGraph.displayScene();
        } 
        this.scene.popMatrix()
    }
}