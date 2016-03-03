((STB, $) => {

    $(() => {
        const $document = $(document),
              $input = $("#num-players"),
              $tiles = $("#tiles"),
              $rollDice = $("#roll-dice"),
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
        });

        $tiles.on("click", event => {
            event.stopPropagation();
            let tile = $(event.target).attr('data-value');
            STB.methods.pickTile(tile)
            // console.log(STB.state.dice);
            // console.log(STB.state.selectableTiles);

            // console.log(STB.state.currentlySelectedTiles);
            // console.log("still selectable", STB.state.selectableTiles);
        })

        $rollDice.on("click", event => {
            event.stopPropagation();
            STB.methods.roll();
            // console.log("dice:", STB.state.dice);
        })
    })

})(window.SHUTTHEBOX, window.jQuery)
