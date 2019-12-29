class GameOrchestrator {
    constructor (scene) {
        this.scene = scene;
        this.gameBoard = new GameBoard(scene);     
        
        
        var filename=getUrlVars()['file'] || "chameleon_1.xml";        
        this.sceneGraph = new MySceneGraph(filename, scene);
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
            for (let i = 0; i < this.gameBoard.pieces.length; i++) {
                if (this.gameBoard.pieces[i].id != id)
                    this.gameBoard.pieces[i].setPicked(false);
            }
            obj.togglePicked()
        }

    }

    display() {
        this.scene.pushMatrix()
        this.gameBoard.display()
        this.sceneGraph.displayScene();
        this.scene.popMatrix()
    }
}