var expect = chai.expect;

describe("Shutthebox", function() {

    it("should be an object", function() {
        expect(typeof SHUTTHEBOX).to.equal("object");
    });

    describe("game logic", function() {

        describe("setPlayers() method", function() {
            it("should add players to state.players", function() {
                SHUTTHEBOX.methods.setPlayers(3);
                expect(SHUTTHEBOX.state.players.length).to.equal(3);
            });
            it("each player is an object with a name and a score", function() {
                var player = SHUTTHEBOX.state.players[0];
                expect(player.name).to.equal("Player 1");
                expect(player.score).to.equal(0);
            })
        });

        describe("startGame() method", function() {
            it("should set player 1 to the currentPlayer", function() {
                SHUTTHEBOX.methods.startGame();
                expect(SHUTTHEBOX.state.currentPlayer).to.equal(SHUTTHEBOX.state.players[0]);
            })
        });

        describe("roll() method", function() {
            beforeEach(function() {
                SHUTTHEBOX.methods.resetGame();
                SHUTTHEBOX.methods.setPlayers(1);
                SHUTTHEBOX.methods.startGame();
            });
            it("should set the turnStarted property to true if at turn start", function() {
                expect(SHUTTHEBOX.state.turnStarted).to.equal(false);
                var diceValue = SHUTTHEBOX.methods.roll();
                expect(SHUTTHEBOX.state.turnStarted).to.equal(true);
            });
            it("should return an array of dice values", function() {
                var diceValue = SHUTTHEBOX.methods.roll();
                expect(Array.isArray(diceValue)).to.equal(true);
            });
            it("should set state.selectableTiles", function() {
                SHUTTHEBOX.methods.roll();
                expect(SHUTTHEBOX.state.selectableTiles.length).to.be.above(0);
            });
        });

        describe("pickTile() method", function() {
            var diceValue;
            var total;
            var pick;
            beforeEach(function() {
                SHUTTHEBOX.methods.resetGame();
                SHUTTHEBOX.methods.setPlayers(1);
                SHUTTHEBOX.methods.startGame();
                diceValue = SHUTTHEBOX.methods.roll();
                total = diceValue[0] + diceValue[1];
                if (total > 9) {
                    pick = total - 5;
                } else {
                    pick = total - 1;
                }
                pick = pick.toString();
            });
            it("should add a tile to the selectedTiles array", function() {
                SHUTTHEBOX.methods.pickTile(pick);
                expect(SHUTTHEBOX.state.currentlySelectedTiles.indexOf(pick)).to.equal(0);
            });
            it("should remove a tile from the selectedTiles array if it's there", function() {
                SHUTTHEBOX.methods.pickTile(pick);
                expect(SHUTTHEBOX.state.currentlySelectedTiles.indexOf(pick)).to.equal(0);
                SHUTTHEBOX.methods.pickTile(pick);
                expect(SHUTTHEBOX.state.currentlySelectedTiles.indexOf(pick)).to.equal(-1);
            });
        });

    })
})
