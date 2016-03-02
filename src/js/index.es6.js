let SHUTTHEBOX = window.SHUTTHEBOX = {};

((STB) => {
    STB.helpers = {};
    STB.methods = {};
    STB.state = {
        players : [],
        currentPlayer: null,
        currentlySelectedTiles: [],
        onlyTileOne : false,
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

    STB.helpers.randomNumGenerator = () => {
        return Math.floor(Math.random() * 6) + 1;
    };
    //If only the 1 tile is open, then the player only rolls one dice.
    STB.helpers.onlyTileOneOpen = () => {
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

    STB.helpers.getRemainingChoices = (dieTotal, selectedAmt) => {
        let difference = dieTotal - selectedAmt
        return STB.helpers.keys.filter(tile => {
            return STB.state.tiles[tile] && parseInt(tile) <= difference;
        })
    };

    STB.helpers.resetGame = () => {
        STB.helpers.keys.forEach(tile => {
            STB.state.tiles[tile] = true;
        });
        STB.state.players = [];
        STB.state.currentlySelected = [];
        STB.state.currentPlayer = null;
    };

    STB.helpers.setPlayers = numPlayers => {
        for (let i = 0; i < numPlayers; i++) {
            STB.state.players.push({
                name : `Player ${i+1}`,
                score : 0
            });
        }
    };

    STB.helpers.returnWinner = () => {
        let indexOfWinningPlayer = 0;
        STB.state.players.forEach((player, index) => {
            if (player.score > STB.state.players[indexOfWinningPlayer].score) {
                indexOfWinningPlayer = index;
            }
        })
        return indexOfWinningPlayer;
    }

    STB.helpers.keys = Object.keys(STB.state.tiles);

    STB.methods.roll = () => {
        let die_one = STB.helpers.randomNumGenerator();
        if (STB.state.onlyTileOne) {
            STB.state.dice = [die_one];
            return STB.state.dice;
        }
        let die_two = STB.helpers.randomNumGenerator();
        STB.state.dice = [die_one, die_two];
        return STB.state.dice;
    };


})(SHUTTHEBOX);
SHUTTHEBOX.helpers.setPlayers(3);
// SHUTTHEBOX.state.onlyTileOne = true;
// console.log("one die", SHUTTHEBOX.methods.roll());
// console.log("one die", SHUTTHEBOX.methods.roll());
// SHUTTHEBOX.state.onlyTileOne = false;
// console.log("2 die", SHUTTHEBOX.methods.roll());
// console.log("2 die", SHUTTHEBOX.methods.roll());
// console.log(SHUTTHEBOX.state.players);
// SHUTTHEBOX.state.players[0].score = 3;
// SHUTTHEBOX.state.players[1].score = 5;
// SHUTTHEBOX.state.players[0].score = 1;
// console.log("Winner is: ", SHUTTHEBOX.helpers.returnWinner())
// console.log(SHUTTHEBOX.helpers.getRemainingChoices(6, 3))
// console.log(SHUTTHEBOX.helpers.getRemainingChoices(9, 5))
// console.log(SHUTTHEBOX.helpers.getRemainingChoices(2, 0))
// console.log(SHUTTHEBOX.helpers.getRemainingChoices(10, 7))
    /* rules:
    At the start of the game all levers or tiles are "open" (cleared, up), showing the numerals 1 to 9.
    During the game, each player plays in turn. A player begins his or her turn by throwing or rolling the die or dice into the box. If 1 is the only tile still open, the player may roll only one die. Otherwise, the player must roll both dice.
    After throwing, the player adds up the dots (pips) on the dice and then "shuts" (closes, covers) one of any combination of open numbers that equals the total number of dots showing on the dice. For example, if the total number of dots is 8, the player may choose any of the following sets of numbers (as long as all of the numbers in the set are available to be covered):
    8
    7, 1
    6, 2
    5, 3
    5, 2, 1
    4, 3, 1
    The player then rolls the dice again, aiming to shut more numbers. The player continues throwing the dice and shutting numbers until reaching a point at which, given the results produced by the dice, the player cannot shut any more numbers. At that point, the player scores the sum of the numbers that are still uncovered. For example, if the numbers 2, 3, and 5 are still open when the player throws a one, the player's score is 10 (2 + 3 + 5 = 10). Play then passes to the next player.
    After every player has taken a turn, the player with the lowest score wins.
    If a player succeeds in closing all of the numbers, he or she is said to have "Shut the Box" – the player wins immediately and the game is over.
    */
