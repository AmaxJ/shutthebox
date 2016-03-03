((STB, $) => {

    $(() => {
        const $document = $(document),
            $input = $("#num-players"),
            $startScreen = $("#start-game"),
            $gameContainer = $("#game"),
            $tiles = $("#tiles"),
            $diceContainer = $("#dice-container"),
            $rollDice = $("#roll-dice"),
            $endTurn = $("#end-turn"),
            $endGame = $("#end-game");

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
            $startScreen.addClass("hide");
            $gameContainer.removeClass("hide");

        });

        $tiles.on("click", event => {
            event.stopPropagation();
            let $tile = $(event.target);
            if ($tile.hasClass("cannot-select")) return;
            STB.methods.pickTile($tile.attr('data-value'));
            showSelectableTiles();
            $tile.toggleClass("selected");
                // console.log(STB.state.dice);
                // console.log(STB.state.selectableTiles);

            // console.log(STB.state.currentlySelectedTiles);
            // console.log("still selectable", STB.state.selectableTiles);
        });

        $rollDice.on("click", event => {
            event.stopPropagation();
            STB.methods.roll();
            $diceContainer.empty();
            let $diceWrapper = $("<div></div>")
            STB.state.dice.forEach(die => {
                let $dieVisual = $('<div class="number"></div>');
                $dieVisual.text(die)
                $diceWrapper.append($dieVisual);
            });
            $diceContainer.prepend($diceWrapper);
        });

        $endTurn.on("click", event => {
            event.stopPropagation();
            STB.methods.endTurn();
        });

        $endGame.on("click", event => {
            event.stopPropagation();
            STB.methods.resetGame();
            $startScreen.removeClass("hide");
            $gameContainer.addClass("hide");
        })

        function showSelectableTiles() {
            $tiles.children().each((index, tile) => {
                let $currentTile = $(tile);
                let value = $currentTile.attr('data-value');
                if (STB.state.selectableTiles.indexOf(value) === -1 || !STB.state.tiles[value]) {
                    $currentTile.addClass("cannot-select");
                }
            });
        }

        function shutTiles() {
            $tiles.children().each((index, tile) => {
                let $currentTile = $(tile);
                let value = $currentTile.attr('data-value');
                if(STB.state.currentlySelectedTiles.indexOf(value) > -1) {
                    $currentTile.addClass("shut");
                }
            })
        }
    })

})(window.SHUTTHEBOX, window.jQuery)
