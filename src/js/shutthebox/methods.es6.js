(STB => {
    let utils = STB.utils;
    let methods = STB.methods = {};

    methods.setPlayers = numPlayers => {
        for (let i = 0; i < numPlayers; i++) {
            STB.state.players.push({
                name: `Player ${i+1}`,
                score: 0
            });
        }
    };

    methods.pickTile = tile => {
        if (typeof tile !== "string") {
            return;
        }
        let selectedTiles = STB.state.currentlySelectedTiles;
        let indexOfTile = selectedTiles.indexOf(tile);
        let diceTotal = utils.getDiceTotal();
        if (indexOfTile === -1) {
            selectedTiles.push(tile);
        } else {
            selectedTiles.splice(indexOfTile, 1);
        }
        STB.state.selectableTiles = utils.getRemainingChoices(diceTotal);
    }

    methods.startGame = () => {
        utils.resetTiles();
        STB.state.currentPlayer = STB.state.players[0];
    };

    methods.resetGame = () => {
        utils.resetTiles();
        STB.state.players = [];
        STB.state.currentlySelected = [];
        STB.state.currentPlayer = null;
        STB.state.onlyTileOne = false;
        STB.state.winner = null;
        STB.state.turnStarted = false;
    };
    //On the roll is when we lock in the selection from the last roll
    methods.roll = () => {
        if (!STB.state.turnStarted) {
            STB.state.turnStarted = true;
            //only allow player to roll again if their last selection was valid
        } else if (!utils.validSelection()) {
            let diceTotal = utils.getDiceTotal();
            alert(`Your selected tiles must add up to ${diceTotal}!`);
            return;
        }
        utils.shutTiles(STB.state.currentlySelectedTiles);
        STB.state.currentlySelectedTiles = [];
        let die_one = utils.randomNumGenerator();
        if (STB.state.onlyTileOne) {
            STB.state.dice = [die_one];
            return STB.state.dice;
        }
        let die_two = utils.randomNumGenerator();
        STB.state.dice = [die_one, die_two];
        STB.state.selectableTiles = utils.getRemainingChoices(utils.getDiceTotal());
        return STB.state.dice;
    };
    //end turn and return winner if all players have gone, otherwise set up next turn
    methods.endTurn = () => {
        let currentPlayer = STB.state.currentPlayer;
        let allPlayers = STB.state.players;
        currentPlayer.score = utils.addOpenTiles();
        if (allPlayers.indexOf(currentPlayer) === allPlayers.length - 1) {
            STB.state.winner = utils.returnWinner();
            return STB.state.winner;
        }
        STB.state.currentPlayer = allPlayers[allPlayers.indexOf(currentPlayer) + 1];
        STB.state.currentlySelected = [];
        STB.state.onlyTileOne = false;
        STB.state.turnStarted = false;
        utils.resetTiles();
        alert(`End of turn for ${currentPlayer.name}! Next up ${STB.state.currentPlayer.name}!`)
    };
})(SHUTTHEBOX);
