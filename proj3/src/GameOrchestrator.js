class GameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.state = "Menu"
        this.gameInited = false;

        this.prologInterface = new PrologInterface(this)
        this.gameSequence = new GameSequence();
        this.animator;

        this.staticKeyframe = new Keyframe(0, [0, 0, 0], [0, 0, 0], [1, 1, 1])
        this.rotate = new Keyframe(0, [0, 0, 0], [0, 180, 0], [1, 1, 1])
        this.rotateStatic = new Keyframe(0, [0, 0, 0], [0, 180, 0], [1, 1, 1])
        this.rotateAnimation = new KeyframeAnimation([this.staticKeyframe])
    }

    initSceneGraph() {
        let filename = this.scene.filename + ".xml"
        this.sceneGraph = new MySceneGraph(filename, this.scene);
    }

    initGameBoard() {
        this.gameBoard = new GameBoard(this.scene)
        this.gameInited = true;
    }

    setState(state) {
        if (state != "Menu" && state != "NextMove" && state != "PickPiece" && state != "PickTile" && state != "Animating" && state != "EndGame") {
            alert("Unknown state")
        }

        this.state = state

        if (state == "EndGame") alert("We have a Winner!")
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
            if (this.prologInterface.winner == null || this.prologInterface.winner == -1) {
                this.prologInterface.winner = null
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
            }
            else {
                this.setState("EndGame")
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
            
            this.prologInterface.requestWinner(this.gameBoard)
            this.gameBoard.switchPlayer()
            this.rotateView(0.5, 3)
            this.setState("NextMove")
        }
    }

    rotateView(animationDelay, animationTime) {
        if (this.gameBoard.playerPlaying.id == 5) {
            this.staticKeyframe.setInstant(this.rotateAnimation.getCurrentTime() + animationDelay)
            this.rotate.setInstant(this.rotateAnimation.getCurrentTime() + animationTime)
            this.rotateAnimation.setKeyframes([this.staticKeyframe, this.rotate])
        }
        else {
            this.rotate.setInstant(this.rotateAnimation.getCurrentTime() - 1)
            this.rotateStatic.setInstant(this.rotateAnimation.getCurrentTime() + animationDelay)
            this.staticKeyframe.setInstant(this.rotateAnimation.getCurrentTime() + animationTime)
            this.rotateAnimation.setKeyframes([this.rotate, this.rotateStatic, this.staticKeyframe])
        }
    }

    update(t) {
        if (this.gameInited) {
            this.gameBoard.update(t)
            this.rotateAnimation.update(t)
        }
    }

    display() {
        this.scene.pushMatrix()
        let mx = this.rotateAnimation.apply()
        this.scene.multMatrix(mx)
        this.scene.translate(-10, 0, 10)
        if (this.state != "Menu") {
            this.sceneGraph.displayScene();
            this.gameBoard.display()
        }
        this.scene.popMatrix()
    }
}