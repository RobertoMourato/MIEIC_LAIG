class GameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.state = "Menu"

        this.prologInterface = new PrologInterface(this)
        this.gameSequence = new GameSequence();
        this.animator;
    }

    initGameBoard() {
        this.gameBoard = new GameBoard(this.scene)
    }

    initSceneGraph(filename) {
        this.sceneGraph = new MySceneGraph(filename, this.scene);
    }

    setState(state) {
        if (state != "Menu" && state != "NextMove" && state != "PickPiece" && state != "PickTile" && state != "Animating" && state != "EndGame")
            alert("Unknown state")

        this.state = state
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */)
            if (results != null && results.length > 0) { // any results?
                for (var i = 0; i < results.length; i++) {
                    var obj = this.scene.pickResults[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = this.scene.pickResults[i][1] // get id
                        this.OnObjectSelected(obj, uniqueId);
                    }
                } // clear results
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
    }

    OnObjectSelected(obj, id) {
        if (this.state != "Animating") {
            if (obj instanceof Piece) {
                if (obj.player == this.gameBoard.playerPlaying) {
                    for (let i = 0; i < this.gameBoard.pieces.length; i++) {
                        if (this.gameBoard.pieces[i].id != id)
                            this.gameBoard.pieces[i].setPicked(false);
                    }
                    let pieceSelected = obj.togglePicked()

                    if (pieceSelected) {
                        this.state = "PickTile"
                    }
                    else {
                        this.state = "PickPiece"
                    }
                    this.gameBoard.highlightTiles(this.prologInterface.validMoves)
                }
            }
            else if (obj instanceof Tile) {
                if (this.state == "PickTile") {
                    if (obj.highlighted) {
                        let piece
                        for (let i = 0; i < this.gameBoard.pieces.length; i++) {
                            if (this.gameBoard.pieces[i].picked) {
                                this.gameBoard.pieces[i].setPicked(false);
                                piece = this.gameBoard.pieces[i]
                                break
                            }
                        }
                        this.gameBoard.highlightTiles(this.prologInterface.validMoves)
                        this.setState("Animating")
                        let move = new GameMove(piece, piece.tile, obj, this.gameBoard)
                        this.gameSequence.addMove(move)
                        this.gameBoard.movePiece(piece, obj)
                    }
                }
            }
        }

    }

    orchestrate() {
        if (this.state == "NextMove") {
            if (this.gameBoard.playerPlaying.type == "Human") {
                this.prologInterface.requestValidMoves(this.gameBoard);
                this.state = "PickPiece";
            }
            else if (this.gameBoard.playerPlaying.type == "CPU") {
                this.prologInterface.requestMove(this.gameBoard)
                var start = new Date().getTime();
                while (1) {
                    if ((new Date().getTime() - start) > 4000) {
                        break;
                    }
                }
                this.setState("Animating")
            }

            return
        }
        else if (this.state == "Animating") {
            if (this.gameBoard.playerPlaying.type == "CPU" && this.prologInterface.move == null) {
                return
            }
            if (this.gameBoard.playerPlaying.type == "CPU" && this.prologInterface.move != null) {
                console.log(this.prologInterface.move)
                let srcLine = this.prologInterface.move[0]['srcLine']
                let srcColumn = this.prologInterface.move[0]['srcColumn']
                let destLine = this.prologInterface.move[0]['destLine']
                let destColumn = this.prologInterface.move[0]['destColumn']

                let piece = this.gameBoard.tiles[srcLine][srcColumn].piece
                let destTile = this.gameBoard.tiles[destLine][destColumn]

                let move = new GameMove(piece, piece.tile, destTile, this.gameBoard)
                this.gameSequence.addMove(move)
                this.gameBoard.movePiece(piece, destTile)
                this.prologInterface.move = null
            }            
            
            this.gameBoard.switchPlayer()
            this.setState("NextMove")
        }
    }

    update(t) {
        if (this.gameBoard != undefined && this.gameBoard != null)
            this.gameBoard.update(t)
    }

    display() {
        this.scene.pushMatrix()
        if (this.state != "Menu") {
            this.sceneGraph.displayScene();
            this.gameBoard.display()
        }
        this.scene.popMatrix()
    }
}