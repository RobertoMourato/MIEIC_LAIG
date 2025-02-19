class GameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.state = "Menu"
        this.gameInited = false;
        this.initLogo();
        this.initMarker();
        this.staticKeyframe = new Keyframe(0, [0, 0, 0], [0, 0, 0], [1, 1, 1])
        this.rotate = new Keyframe(0, [0, 0, 0], [0, 180, 0], [1, 1, 1])
        this.rotateStatic = new Keyframe(0, [0, 0, 0], [0, 180, 0], [1, 1, 1])
    }

    initGame() {
        let filename = this.scene.filename + ".xml"
        this.sceneGraph = new MySceneGraph(filename, this.scene);

        this.gameBoard = new GameBoard(this.scene)

        this.prologInterface = new PrologInterface(this)

        this.gameSequence = new GameSequence();
        //this.animator = new ;

        this.gameInited = true;
        this.rotateAnimation = new KeyframeAnimation([this.staticKeyframe])
        this.setState("NextMove")
    }

    initMarker() {
        this.marker = new MyRectangle(this.scene, '', 0, 0.5, 0, 0.5);
        this.markerShader = new CGFshader(this.scene.gl, 'shaders/marker.vert', 'shaders/marker.frag');

        this.markerShader.setUniformsValues({ uSampler: 0 });
        this.markerShader.setUniformsValues({ timeFactor: 0 });

        this.green0 = new CGFtexture(this.scene, 'scenes/images/green0.png')
        this.green1 = new CGFtexture(this.scene, 'scenes/images/green1.png');
        this.green2 = new CGFtexture(this.scene, 'scenes/images/green2.png');
        this.green3 = new CGFtexture(this.scene, 'scenes/images/green3.png');
        this.green4 = new CGFtexture(this.scene, 'scenes/images/green4.png');

        this.blue0 = new CGFtexture(this.scene, 'scenes/images/blue0.png');
        this.blue1 = new CGFtexture(this.scene, 'scenes/images/blue1.png');
        this.blue2 = new CGFtexture(this.scene, 'scenes/images/blue2.png');
        this.blue3 = new CGFtexture(this.scene, 'scenes/images/blue3.png');
        this.blue4 = new CGFtexture(this.scene, 'scenes/images/blue4.png');
    }

    initLogo() {
        this.rectangle = new MyRectangle(this.scene, '', 0, 2, 0, 2);
        this.shader = new CGFshader(this.scene.gl, 'shaders/camera.vert', 'shaders/camera.frag');

        this.shader.setUniformsValues({ uSampler: 0 });
        this.shader.setUniformsValues({ timeFactor: 0 });

        this.texture = new CGFtexture(this.scene, 'scenes/images/chameleon.png')
    }

    setState(state) {
        if (state != "Menu" && state != "LoadScene" && state != "NextMove" && state != "PickPiece" && state != "PickTile" && state != "Animating" && state != "EvaluateWinner" && state != "EndGame") {
            alert("Unknown state")
        }

        this.state = state

        if (state == "EndGame") {
            alert("We have a Winner!")
                //this.scene.exit()
        }

    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */ )
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
                    } else {
                        this.state = "PickPiece"
                    }
                    this.gameBoard.highlightTiles(this.prologInterface.validMoves)
                }
            } else if (obj instanceof Tile) {
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

                        if (obj.piece != null) {
                            this.gameBoard.playerPlaying.score++;
                        }

                        let move = new GameMove(piece, piece.tile, obj, this.gameBoard)
                        this.gameSequence.addMove(move)
                        this.gameBoard.movePiece(piece, obj)
                    }
                }
            }
        }

    }

    orchestrate() {
        if (this.state == "LoadScene") {
            if (!this.scene.sceneInited) {
                return
            }
            this.setState(this.oldState)

        } else if (this.state == "NextMove") {
            if (this.gameBoard.playerPlaying.type == "Human") {
                this.prologInterface.requestValidMoves(this.gameBoard);
                this.state = "PickPiece";
            } else if (this.gameBoard.playerPlaying.type == "CPU") {
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
        } else if (this.state == "Animating") {
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

                if (destTile != null) {
                    this.gameBoard.playerPlaying.score++;
                }

                let move = new GameMove(piece, piece.tile, destTile, this.gameBoard)
                this.gameSequence.addMove(move)
                this.gameBoard.movePiece(piece, destTile)
                this.prologInterface.move = null
            }

            this.prologInterface.requestWinner(this.gameBoard)
            this.gameBoard.switchPlayer()
            this.rotateView(0.5, 3)
            this.setState("EvaluateWinner")
        } else if (this.state == "EvaluateWinner") {
            if (this.prologInterface.winner == null) {
                return
            } else if (this.prologInterface.winner == -1) {
                this.prologInterface.winner = null
                this.setState("NextMove")
            } else {
                this.prologInterface.winner = null
                this.setState("EndGame")
            }
        }
    }

    rotateView(animationDelay, animationTime) {
        if (this.gameBoard.playerPlaying.id == 5) {
            this.staticKeyframe.setInstant(this.rotateAnimation.getCurrentTime() + animationDelay)
            this.rotate.setInstant(this.rotateAnimation.getCurrentTime() + animationTime)
            this.rotateAnimation.setKeyframes([this.staticKeyframe, this.rotate])
        } else {
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
        if (this.state != "Menu" && this.scene.sceneInited) {

            /*MARKER*/
            this.scene.setActiveShader(this.markerShader);
            if (this.gameBoard.playerPlaying == this.gameBoard.players[0]) {
                switch (this.gameBoard.playerPlaying.score) {
                    case 0:
                        this.green0.bind();
                        this.marker.display();
                        this.green0.unbind();
                        break;
                    case 1:
                        this.green1.bind();
                        this.marker.display();
                        this.green1.unbind();
                        break;
                    case 2:
                        this.green2.bind();
                        this.marker.display();
                        this.green2.unbind();
                        break;
                    case 3:
                        this.green3.bind();
                        this.marker.display();
                        this.green3.unbind();
                        break;
                    case 4:
                        this.green4.bind();
                        this.marker.display();
                        this.green4.unbind();
                        break;
                }
            } else {
                switch (this.gameBoard.playerPlaying.score) {
                    case 0:
                        this.blue0.bind();
                        this.marker.display();
                        this.blue0.unbind();
                        break;
                    case 1:
                        this.blue1.bind();
                        this.marker.display();
                        this.blue1.unbind();
                        break;
                    case 2:
                        this.blue2.bind();
                        this.marker.display();
                        this.blue2.unbind();
                        break;
                    case 3:
                        this.blue3.bind();
                        this.marker.display();
                        this.blue3.unbind();
                        break;
                    case 4:
                        this.blue4.bind();
                        this.marker.display();
                        this.blue4.unbind();
                        break;
                }
            }
            this.scene.setActiveShader(this.scene.defaultShader);
            /*MARKER*/

            this.scene.pushMatrix()
            if (this.scene.mode == "Player vs Player") {
                let mx = this.rotateAnimation.apply()
                this.scene.multMatrix(mx)
            }
            this.scene.translate(-10, 0, 10)
            this.sceneGraph.displayScene();
            this.gameBoard.display()
            this.scene.popMatrix()
        } else {
            this.scene.setActiveShader(this.shader);
            this.texture.bind();
            this.rectangle.display();
            this.texture.unbind();
            this.scene.setActiveShader(this.scene.defaultShader);
        }
    }
}