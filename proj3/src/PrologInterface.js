class PrologInterface {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.validMoves = []
        this.move = null
        this.winner = null
    }

    requestValidMoves(gameboard) {
        let request = this.parseBoardToProlog(gameboard)
        request = "[validMoves," + request + "," + gameboard.playerPlaying.id + "]"
        this.validMoves = [];
        this.getPrologRequest(request, "validMoves")
    }

    requestMove(gameboard) {
        let request = this.parseBoardToProlog(gameboard)
        let level
        if (gameboard.playerPlaying.level == "Level2")
            level = 2
        else level = 1
        request = "[chooseMove," + request + "," + gameboard.playerPlaying.id + "," + level +"]"
        this.getPrologRequest(request, "move")
    }

    requestWinner(gameboard) {
        let request = this.parseBoardToProlog(gameboard)
        request = "[gameOver," + request + "," + gameboard.playerPlaying.id + "]"

        this.getPrologRequest(request, "gameOver")
    }

    parseBoardToProlog(gameboard) {
        let tiles = gameboard.tiles
        let boardString = "["
        for (let i = 0; i < 5; i++) {
            let line = "["
            for (let j = 0; j < 5; j++) {
                let tile = tiles[i][j]
                if (tile.piece != null) {
                    line = line + tile.piece.player.id
                    if (tile.piece.color == "Black")
                        line = line + "0"
                    else if (tile.piece.color == "White")
                        line = line + "1"
                    else alert("Unknown color property")

                    if (tile.color == "Black")
                        line = line + "0"
                    else if (tile.color == "White")
                        line = line + "1"
                    else alert("Unknown color property")
                }
                else {
                    if (tile.color == "Black")
                        line = line + "0"
                    else if (tile.color == "White") line = line + "1"
                }
                if (j != 4) line = line + ","
            }
            line = line + "]"
            boardString = boardString + line
            if (i != 4) boardString = boardString + ","
        }
        boardString = boardString + "]"

        return boardString
    }

    getPrologRequest(requestString, onSuccess, onError, port) {
        let orchestrator = this;
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = function (reply) {
                                        //console.log("Request successful. Reply: " + reply.target.response);
                                        if (onSuccess == "validMoves") orchestrator.parseMovesToJS(this)
                                        else if (onSuccess == "move") orchestrator.parseMoveToJS(this)
                                        else if (onSuccess == "gameOver") orchestrator.parseWinnerToJS(this)
                                    };
        request.onerror = onError || function () { console.log("Error waiting for response"); alert("No SICStus server found"); orchestrator.orchestrator.scene.exit()};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    letterToNumber(letter) {
        let number
        switch (letter) {
            case 'a':
                number = '0';
                break;
            case 'b':
                number = '1';
                break;
            case 'c':
                number = '2';
                break;
            case 'd':
                number = '3';
                break;
            case 'e':
                number = '4';
                break;
            default:
                break;
        }
        return number
    }

    parseMovesToJS(reply) {
        let moves = reply.responseText
        moves = moves.substring(1, moves.length - 1)

        while (moves != "") {
            let srcLine = this.letterToNumber(moves.charAt(1))
            let source = srcLine + (moves.charAt(3) - 1)
            
            let destLine = this.letterToNumber(moves.charAt(5))
            let destination = destLine + (moves.charAt(7) - 1)
            
            if (this.validMoves[source] == undefined)
            this.validMoves[source] = []

            this.validMoves[source].push(destination)

            moves = moves.substring(10)
        }
        //console.log(this.validMoves)
    }

    parseMoveToJS(reply) {
        let move = reply.responseText
        let srcLine = parseInt(this.letterToNumber(move.charAt(1)), 10)
        let srcColumn = parseInt(move.charAt(3) - 1, 10)
            
        let destLine = parseInt(this.letterToNumber(move.charAt(5)), 10)
        let destColumn = parseInt(move.charAt(7) - 1, 10)

        this.move = [{'srcLine': srcLine, 'srcColumn': srcColumn, 'destLine': destLine, 'destColumn': destColumn}]
    }

    parseWinnerToJS(reply) {
        console.log(reply.responseText)
        this.winner = reply.responseText
    }
}
