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
})(SHUTTHEBOX);