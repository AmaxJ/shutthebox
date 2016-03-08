(STB => {
    let utils = STB.utils = {};

    utils.keys = Object.keys(STB.state.tiles);

    utils.randomNumGenerator = () => {
        return Math.floor(Math.random() * 6) + 1;
    };
    //If only the 1 tile is open, then the player only rolls one dice.
    utils.onlyTileOneOpen = () => {
        if (STB.state.onlyTileOne) return;
        let onlyTileOne = true;
        utils.keys.forEach(tile => {
            if (tile !== "1" && STB.state.tiles[tile] === true) {
                onlyTileOne = false;
            }
        });
        STB.state.onlyTileOne = onlyTileOne;
        return onlyTileOne;
    };

    utils.getDiceTotal = () => {
        return STB.state.dice.reduce((a, b) => a + b);
    };

    utils.shutTiles = tileArr => {
        tileArr.forEach(tile => {
            STB.state.tiles[tile] = false;
        });
    };

    utils.getRemainingChoices = (dieTotal) => {
        let selectedTiles = STB.state.currentlySelectedTiles;
        let selectedAmt;
        let difference;
        if (selectedTiles.length === 0) {
            selectedAmt = 0;
        } else {
            selectedAmt = selectedTiles
                .map(tile => parseInt(tile))
                .reduce((a, b) => a + b);
        }
        difference = dieTotal - selectedAmt;
        return utils.keys.filter(tile => {
            return STB.state.tiles[tile] && parseInt(tile) <= difference && selectedTiles.indexOf(tile) === -1;
        });
    };

    utils.resetTiles = () => {
        utils.keys.forEach(tile => {
            STB.state.tiles[tile] = true;
        });
    };


    utils.addOpenTiles = () => {
        let score = 0;
        utils.keys.forEach(tile => {
            if (STB.state.tiles[tile]) {
                score += parseInt(tile);
            }
        });
        return score;
    };

    utils.returnWinner = () => {
        let indexOfWinningPlayer = 0;
        STB.state.players.forEach((player, index) => {
            if (player.score < STB.state.players[indexOfWinningPlayer].score) {
                indexOfWinningPlayer = index;
            }
        })
        return STB.state.players[indexOfWinningPlayer];
    };

    utils.validSelection = () => {
        if (STB.state.currentlySelectedTiles.length === 0) return;
        let dieTotal = utils.getDiceTotal();
        let selectionTotal = STB.state.currentlySelectedTiles
            .map(tile => parseInt(tile))
            .reduce((a, b) => a + b);
        return dieTotal === selectionTotal;
    };

    utils.isSolutionPossible = (total, arr) => {
        let combinations = [[]];
        let sum;
        arr.map(num => parseInt(num))
           .forEach(num => {
            combinations.forEach(combo => {
                combinations.push(combo.concat(num));
            });
        });
        for (let i=1, len=combinations.length; i<len; i++) {
            sum = combinations[i].reduce((a,b) => a + b);
            if (sum === total) return true;
        }
        return false;
    }

})(SHUTTHEBOX);
