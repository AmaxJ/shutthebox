#[Shut The Box](https://amaxj.github.io/shutthebox/)

Shut the Box, also called Canoga, Klackers, Zoltan Box, Batten Down the Hatches, Jackpot or High Rollers, is a game of dice for one or more players, commonly played in a group of two to four for stakes.

##[Play now!](https://amaxj.github.io/shutthebox/)

##Rules
At the start of the game all levers or tiles are "open" (cleared, up), showing the numerals 1 to 9.
During the game, each player plays in turn. A player begins his or her turn by throwing or rolling the die or dice into the box. If 1 is the only tile still open, the player may roll only one die. Otherwise, the player must roll both dice.
After throwing, the player adds up the dots (pips) on the dice and then "shuts" (closes, covers) one of any combination of open numbers that equals the total number of dots showing on the dice.

[More Info](https://en.wikipedia.org/wiki/Shut_the_Box)

##Development thoughts:
I chose jQuery for this project initially because I felt it was a bit on the smaller size for a framework like Angular. (I considered react but wasn't sure I would finish in time if I went down that road due to not having used react much.) However, I'm not convinced that this was the absolute best choice. I can easily see how this project could grow painful to maintain if it got any larger.

Other then that, I had fun designing the game logic and the UI. I considered making the SHUTTHEBOX object a class but I decided not to in the end. I chose to maintain game state in an object nested on the SHUTTHEBOX object as this seemed easy to work with. I'd be interested in learning about alternative approaches however. Cheers, and enjoy the game!