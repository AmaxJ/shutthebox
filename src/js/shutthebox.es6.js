let SHUTTHEBOX = window.SHUTTHEBOX = {};

(STB => {
    STB.state = {
        players: [],
        currentPlayer: null,
        currentlySelectedTiles: [],
        selectableTiles: [],
        onlyTileOne: false,
        turnStarted: false,
        winner: null,
        tiles: {
            "1": true,
            "2": true,
            "3": true,
            "4": true,
            "5": true,
            "6": true,
            "7": true,
            "8": true,
            "9": true
        },
        dice: [1, 1]
    };
    STB.methods = {};
    STB.helpers = {};
    STB.helpers.keys = Object.keys(STB.state.tiles);

    let randomNumGenerator = () => {
        return Math.floor(Math.random() * 6) + 1;
    };
    //If only the 1 tile is open, then the player only rolls one dice.
    let onlyTileOneOpen = () => {
        if (STB.state.onlyTileOne) return;
        let onlyTileOne = true;
        STB.helpers.keys.forEach(tile => {
            if (tile !== "1" && STB.state.tiles[tile] === true) {
                onlyTileOne = false;
            }
        });
        STB.state.onlyTileOne = onlyTileOne;
        return onlyTileOne;
    };

    let getDiceTotal = () => {
        return STB.state.dice.reduce((a, b) => a + b);
    };

    let shutTiles = tileArr => {
        tileArr.forEach(tile => {
            STB.state.tiles[tile] = false;
        });
    };

    let getRemainingChoices = (dieTotal) => {
        let selectedTiles = STB.state.currentlySelectedTiles;
        let selectedAmt;
        if (selectedTiles.length === 0) {
            selectedAmt = 0;
        } else {
            selectedAmt = selectedTiles
                .map(tile => parseInt(tile))
                .reduce((a, b) => a + b);
        }
        let difference = dieTotal - selectedAmt;
        return STB.helpers.keys.filter(tile => {
            return STB.state.tiles[tile] && parseInt(tile) <= difference && selectedTiles.indexOf(tile) === -1;
        });
    };

    let resetTiles = () => {
        STB.helpers.keys.forEach(tile => {
            STB.state.tiles[tile] = true;
        });
    };


    let addOpenTiles = () => {
        let score = 0;
        STB.helpers.keys.forEach(tile => {
            if (STB.state.tiles[tile]) {
                score += parseInt(tile);
            }
        });
        return score;
    };

    let returnWinner = () => {
        let indexOfWinningPlayer = 0;
        STB.state.players.forEach((player, index) => {
            if (player.score < STB.state.players[indexOfWinningPlayer].score) {
                indexOfWinningPlayer = index;
            }
        })
        return STB.state.players[indexOfWinningPlayer];
    };

    let validSelection = () => {
        if (STB.state.currentlySelectedTiles.length === 0) return;
        let dieTotal = getDiceTotal();
        let selectionTotal = STB.state.currentlySelectedTiles
            .map(tile => parseInt(tile))
            .reduce((a, b) => a + b);
        return dieTotal === selectionTotal;
    };

    STB.methods.setPlayers = numPlayers => {
        for (let i = 0; i < numPlayers; i++) {
            STB.state.players.push({
                name: `Player ${i+1}`,
                score: 0
            });
        }
    };

    STB.methods.pickTile = tile => {
        if (typeof tile !== "string") {
            return;
        }
        let selectedTiles = STB.state.currentlySelectedTiles;
        let indexOfTile = selectedTiles.indexOf(tile);
        let diceTotal = getDiceTotal();
        if (indexOfTile === -1) {
            selectedTiles.push(tile);
        } else {
            selectedTiles.splice(indexOfTile, 1);
        }
        STB.state.selectableTiles = getRemainingChoices(diceTotal);
    }

    STB.methods.startGame = () => {
        resetTiles();
        STB.state.currentPlayer = STB.state.players[0];
    };

    STB.methods.resetGame = () => {
        resetTiles();
        STB.state.players = [];
        STB.state.currentlySelected = [];
        STB.state.currentPlayer = null;
        STB.state.onlyTileOne = false;
        STB.state.winner = null;
        STB.state.turnStarted = false;
    };
    //On the roll is when we lock in the selection from the last roll
    STB.methods.roll = () => {
        if (!STB.state.turnStarted) {
            STB.state.turnStarted = true;
            //only allow player to roll again if their last selection was valid
        } else if (!validSelection()) {
            let diceTotal = getDiceTotal();
            alert(`Your selected tiles must add up to ${diceTotal}!`);
            return;
        }
        shutTiles(STB.state.currentlySelectedTiles);
        STB.state.currentlySelectedTiles = [];
        let die_one = randomNumGenerator();
        if (STB.state.onlyTileOne) {
            STB.state.dice = [die_one];
            return STB.state.dice;
        }
        let die_two = randomNumGenerator();
        STB.state.dice = [die_one, die_two];
        STB.state.selectableTiles = getRemainingChoices(getDiceTotal());
        return STB.state.dice;
    };
    //end turn and return winner if all players have gone, otherwise set up next turn
    STB.methods.endTurn = () => {
        let currentPlayer = STB.state.currentPlayer;
        let allPlayers = STB.state.players;
        currentPlayer.score = addOpenTiles();
        if (allPlayers.indexOf(currentPlayer) === allPlayers.length - 1) {
            STB.state.winner = returnWinner();
            return STB.state.winner;
        }
        STB.state.currentPlayer = allPlayers[allPlayers.indexOf(currentPlayer) + 1];
        STB.state.currentlySelected = [];
        STB.state.onlyTileOne = false;
        STB.state.turnStarted = false;
        resetTiles();
        alert(`End of turn for ${currentPlayer.name}! Next up ${STB.state.currentPlayer.name}!`)
    };
})(SHUTTHEBOX);
