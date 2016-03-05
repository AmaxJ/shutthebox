"use strict";

var SHUTTHEBOX = window.SHUTTHEBOX = {};

(function (STB) {
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
})(SHUTTHEBOX);
"use strict";

(function (STB) {
    var utils = STB.utils = {};

    utils.keys = Object.keys(STB.state.tiles);

    utils.randomNumGenerator = function () {
        return Math.floor(Math.random() * 6) + 1;
    };
    //If only the 1 tile is open, then the player only rolls one dice.
    utils.onlyTileOneOpen = function () {
        if (STB.state.onlyTileOne) return;
        var onlyTileOne = true;
        utils.keys.forEach(function (tile) {
            if (tile !== "1" && STB.state.tiles[tile] === true) {
                onlyTileOne = false;
            }
        });
        STB.state.onlyTileOne = onlyTileOne;
        return onlyTileOne;
    };

    utils.getDiceTotal = function () {
        return STB.state.dice.reduce(function (a, b) {
            return a + b;
        });
    };

    utils.shutTiles = function (tileArr) {
        tileArr.forEach(function (tile) {
            STB.state.tiles[tile] = false;
        });
    };

    utils.getRemainingChoices = function (dieTotal) {
        var selectedTiles = STB.state.currentlySelectedTiles;
        var selectedAmt = undefined;
        if (selectedTiles.length === 0) {
            selectedAmt = 0;
        } else {
            selectedAmt = selectedTiles.map(function (tile) {
                return parseInt(tile);
            }).reduce(function (a, b) {
                return a + b;
            });
        }
        var difference = dieTotal - selectedAmt;
        return utils.keys.filter(function (tile) {
            return STB.state.tiles[tile] && parseInt(tile) <= difference && selectedTiles.indexOf(tile) === -1;
        });
    };

    utils.resetTiles = function () {
        utils.keys.forEach(function (tile) {
            STB.state.tiles[tile] = true;
        });
    };

    utils.addOpenTiles = function () {
        var score = 0;
        utils.keys.forEach(function (tile) {
            if (STB.state.tiles[tile]) {
                score += parseInt(tile);
            }
        });
        return score;
    };

    utils.returnWinner = function () {
        var indexOfWinningPlayer = 0;
        STB.state.players.forEach(function (player, index) {
            if (player.score < STB.state.players[indexOfWinningPlayer].score) {
                indexOfWinningPlayer = index;
            }
        });
        return STB.state.players[indexOfWinningPlayer];
    };

    utils.validSelection = function () {
        if (STB.state.currentlySelectedTiles.length === 0) return;
        var dieTotal = utils.getDiceTotal();
        var selectionTotal = STB.state.currentlySelectedTiles.map(function (tile) {
            return parseInt(tile);
        }).reduce(function (a, b) {
            return a + b;
        });
        return dieTotal === selectionTotal;
    };

    utils.isSolutionPossible = function (total, arr) {
        var combinations = [[]];
        arr.map(function (num) {
            return parseInt(num);
        }).forEach(function (num) {
            combinations.forEach(function (combo) {
                combinations.push(combo.concat(num));
            });
        });
        for (var i = 1, len = combinations.length; i < len; i++) {
            var sum = combinations[i].reduce(function (a, b) {
                return a + b;
            });
            if (sum === total) return true;
        }
        return false;
    };
})(SHUTTHEBOX);
"use strict";

(function (STB) {
    var utils = STB.utils;
    var methods = STB.methods = {};

    methods.setPlayers = function (numPlayers) {
        for (var i = 0; i < numPlayers; i++) {
            STB.state.players.push({
                name: "Player " + (i + 1),
                score: 0
            });
        }
    };

    methods.pickTile = function (tile) {
        if (typeof tile !== "string") {
            return;
        }
        var selectedTiles = STB.state.currentlySelectedTiles;
        var indexOfTile = selectedTiles.indexOf(tile);
        var diceTotal = utils.getDiceTotal();
        if (indexOfTile === -1) {
            selectedTiles.push(tile);
        } else {
            selectedTiles.splice(indexOfTile, 1);
        }
        STB.state.selectableTiles = utils.getRemainingChoices(diceTotal);
    };

    methods.startGame = function () {
        utils.resetTiles();
        STB.state.currentPlayer = STB.state.players[0];
    };

    methods.resetGame = function () {
        utils.resetTiles();
        STB.state.players = [];
        STB.state.currentlySelectedTiles = [];
        STB.state.currentPlayer = null;
        STB.state.onlyTileOne = false;
        STB.state.winner = null;
        STB.state.turnStarted = false;
    };
    //On the roll is when we lock in the selection from the last roll
    methods.roll = function () {
        if (!STB.state.turnStarted) {
            STB.state.turnStarted = true;
            //only allow player to roll again if their last selection was valid
        } else if (!utils.validSelection()) {
                var _diceTotal = utils.getDiceTotal();
                alert("Your selected tiles must add up to " + _diceTotal + "!");
                return;
            }
        utils.shutTiles(STB.state.currentlySelectedTiles);
        STB.state.currentlySelectedTiles = [];
        var die_one = utils.randomNumGenerator();
        if (STB.state.onlyTileOne) {
            STB.state.dice = [die_one];
            return STB.state.dice;
        }
        var die_two = utils.randomNumGenerator();
        STB.state.dice = [die_one, die_two];
        var diceTotal = utils.getDiceTotal();
        STB.state.selectableTiles = utils.getRemainingChoices(diceTotal);
        if (!utils.isSolutionPossible(diceTotal, STB.state.selectableTiles)) {
            return "No solution possible";
        }
        return STB.state.dice;
    };
    //end turn and return winner if all players have gone, otherwise set up next turn
    methods.endTurn = function () {
        var currentPlayer = STB.state.currentPlayer;
        var allPlayers = STB.state.players;
        currentPlayer.score = utils.addOpenTiles();
        utils.resetTiles();
        STB.state.currentlySelectedTiles = [];
        if (allPlayers.indexOf(currentPlayer) === allPlayers.length - 1) {
            STB.state.winner = utils.returnWinner();
            return STB.state.winner;
        }
        STB.state.currentPlayer = allPlayers[allPlayers.indexOf(currentPlayer) + 1];
        STB.state.onlyTileOne = false;
        STB.state.turnStarted = false;
        alert("End of turn for " + currentPlayer.name + "! Next up " + STB.state.currentPlayer.name + "!");
    };
})(SHUTTHEBOX);
"use strict";

(function (STB, $) {

    $(function () {
        var $document = $(document);
        var $input = $("#num-players");
        var $startScreen = $(".start-screen");
        var $gameContainer = $("#game");
        var $tiles = $("#tiles");
        var $diceContainer = $("#dice-container");
        var $rollDice = $("#roll-dice");
        var $endTurn = $("#end-turn");
        var $endGame = $("#end-game");
        var $scores = $("#score-board");

        $document.on('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var numPlayers = parseInt($input.val());
            if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 4) {
                alert("Please enter a number between 1 and 4!");
                return;
            }
            STB.methods.setPlayers(numPlayers);
            STB.methods.startGame();
            $tiles.addClass("cannot-select");
            $startScreen.addClass("slide-down");
            $gameContainer.removeClass("hide");
            updateLeaderBoard();
        });

        $tiles.on("click", function (event) {
            event.stopPropagation();
            var $tile = $(event.target);
            var value = $tile.attr("data-value");
            var isShut = $tile.hasClass("shut");
            var notSelectable = $tile.hasClass("cannot-select");
            if (isShut || !STB.state.turnStarted) {
                return;
            }
            if (notSelectable && STB.state.currentlySelectedTiles.indexOf(value) === -1) {
                return;
            }
            STB.methods.pickTile($tile.attr('data-value'));
            showSelectableTiles();
            $tile.toggleClass("selected");
        });

        $rollDice.on("click", function (event) {
            event.stopPropagation();
            $tiles.removeClass("cannot-select");
            //this method returns the string 'No outcome possible' if so
            var outcome = STB.methods.roll();
            shutTiles();
            $diceContainer.empty();
            var $diceWrapper = $("<div></div>");
            STB.state.dice.forEach(function (die) {
                var $dieVisual = $('<div class="number"></div>');
                $dieVisual.text(die);
                $diceWrapper.append($dieVisual);
            });
            $diceContainer.prepend($diceWrapper);
            showSelectableTiles();
            if (outcome === "No solution possible") {
                endTurn();
            }
        });

        $endTurn.on("click", endTurn);

        $endGame.on("click", function (event) {
            event.stopPropagation();
            reset();
            $startScreen.removeClass("slide-down");
        });

        function endTurn(event) {
            if (event) event.stopPropagation();
            STB.methods.endTurn();
            if (STB.state.winner !== null) {
                updateLeaderBoard();
                alert(STB.state.winner.name + " is the winner!");
                reset();
                $startScreen.removeClass("slide-down");
            }
            $tiles.addClass("cannot-select");
            $tiles.children().each(function (index, tile) {
                var $currentTile = $(tile);
                $currentTile.removeClass("cannot-select");
                $currentTile.removeClass("selected");
            });
            $diceContainer.empty();
            cleanTiles();
            updateLeaderBoard();
        }

        function showSelectableTiles() {
            $tiles.children().each(function (index, tile) {
                var $currentTile = $(tile);
                var value = $currentTile.attr('data-value');
                if (STB.state.selectableTiles.indexOf(value) === -1 || !STB.state.tiles[value]) {
                    $currentTile.addClass("cannot-select");
                } else if ($currentTile.hasClass("cannot-select")) {
                    $currentTile.removeClass("cannot-select");
                }
            });
        }

        function shutTiles() {
            $tiles.children().each(function (index, tile) {
                var $currentTile = $(tile);
                var value = $currentTile.attr('data-value');
                if (!STB.state.tiles[value]) {
                    $currentTile.addClass("shut");
                }
            });
        }

        function cleanTiles() {
            $tiles.children().each(function (index, tile) {
                var $currentTile = $(tile);
                $currentTile.removeClass();
                $currentTile.addClass("number");
            });
        }

        function updateLeaderBoard() {
            $scores.empty();
            var $scoreList = $("<div></div>");
            STB.state.players.forEach(function (player) {
                var $playerEntry = $("<h3>" + player.name + " - " + player.score + "</h3>");
                if (player === STB.state.currentPlayer) {
                    $playerEntry.addClass("current-player");
                }
                $scoreList.append($playerEntry);
            });
            $scores.append($scoreList);
        }

        function reset() {
            STB.methods.resetGame();
            cleanTiles();
            $diceContainer.empty();
            $gameContainer.addClass("hide");
        }
    });
})(window.SHUTTHEBOX, window.jQuery);