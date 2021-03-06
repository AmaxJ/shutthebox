((STB, $) => {

    $(() => {
        const $document = $(document);
        const $input = $("#num-players");
        const $startScreen = $(".start-screen");
        const $gameContainer = $("#game");
        const $tiles = $("#tiles");
        const $diceContainer = $("#dice-container");
        const $rollDice = $("#roll-dice");
        const $endTurn = $("#end-turn");
        const $endGame = $("#end-game");
        const $scores = $("#score-board");

        $document.on('submit', event => {
            event.preventDefault();
            event.stopPropagation();
            let numPlayers = parseInt($input.val());
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

        $tiles.on("click", event => {
            event.stopPropagation();
            let $tile = $(event.target);
            let value = $tile.attr("data-value");
            let isShut = $tile.hasClass("shut");
            let notSelectable = $tile.hasClass("cannot-select");
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

        $rollDice.on("click", event => {
            event.stopPropagation();
            $tiles.removeClass("cannot-select");
            //this method returns the string 'No outcome possible' if so
            let outcome = STB.methods.roll();
            shutTiles();
            $diceContainer.empty();
            let $diceWrapper = $("<div></div>")
            STB.state.dice.forEach(die => {
                let $dieVisual = $('<div class="number"></div>');
                $dieVisual.text(die)
                $diceWrapper.append($dieVisual);
            });
            $diceContainer.prepend($diceWrapper);
            showSelectableTiles();
            if (outcome === "No solution possible") {
                endTurn();
            }
        });

        $endTurn.on("click", endTurn);

        $endGame.on("click", event => {
            event.stopPropagation();
            reset();
            $startScreen.removeClass("slide-down");
        })

        function endTurn(event) {
            if (event) event.stopPropagation();
            STB.methods.endTurn();
            if (STB.state.winner !== null) {
                updateLeaderBoard();
                alert(`${STB.state.winner.name} is the winner!`);
                reset();
                $startScreen.removeClass("slide-down");
            }
            $tiles.addClass("cannot-select");
            $tiles.children().each((index, tile) => {
                let $currentTile = $(tile);
                $currentTile.removeClass("cannot-select");
                $currentTile.removeClass("selected");
            });
            $diceContainer.empty();
            cleanTiles();
            updateLeaderBoard();
        }

        function showSelectableTiles() {
            let $currentTile;
            let value;
            $tiles.children().each((index, tile) => {
                $currentTile = $(tile);
                value = $currentTile.attr('data-value');
                if (STB.state.selectableTiles.indexOf(value) === -1 || !STB.state.tiles[value]) {
                    $currentTile.addClass("cannot-select");
                } else if ($currentTile.hasClass("cannot-select")) {
                    $currentTile.removeClass("cannot-select");
                }
            });
        }

        function shutTiles() {
            let $currentTile;
            let value;
            $tiles.children().each((index, tile) => {
                $currentTile = $(tile);
                value = $currentTile.attr('data-value');
                if (!STB.state.tiles[value]) {
                    $currentTile.addClass("shut");
                }
            });
        }

        function cleanTiles() {
            let $currentTile;
            $tiles.children().each((index, tile) => {
                $currentTile = $(tile);
                $currentTile.removeClass();
                $currentTile.addClass("number");
            });
        }

        function updateLeaderBoard() {
            let $scoreList;
            let $playerEntry;
            $scores.empty();
            $scoreList = $("<div></div>");
            STB.state.players.forEach(player => {
                $playerEntry = $(`<h3>${player.name} - ${player.score}</h3>`);
                if (player === STB.state.currentPlayer) {
                    $playerEntry.addClass("current-player")
                }
                $scoreList.append($playerEntry);
            })
            $scores.append($scoreList);
        }

        function reset() {
            STB.methods.resetGame();
            cleanTiles();
            $diceContainer.empty();
            $gameContainer.addClass("hide");
        }
    })

})(window.SHUTTHEBOX, window.jQuery)
