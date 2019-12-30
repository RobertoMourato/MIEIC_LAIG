class PrologInterface {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }

    requestValidMoves(gameboard) {
        let request = this.parseBoardToProlog(gameboard)
        request = "[validMoves," + request + "," + gameboard.playerPlaying.id + "]"

        this.getPrologRequest(request, this.parseMovesToJS)
    }

    requestWinner(gameboard) {
        let request = this.parseBoardToProlog(gameboard)
        request = "[gameOver," + request + "," + gameboard.playerPlaying.id + "]"

        this.getPrologRequest(request, this.parseMovesToJS)
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
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    parseMovesToJS(reply) {
        console.log(reply.target.response)
    }

    parseWinnerToJS(reply) {
        console.log(reply.target.response)
    }   


}