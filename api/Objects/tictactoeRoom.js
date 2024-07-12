module.exports = function tictactoeRoom(roomsize = 0) {
  this.type = "tictac";
  this.roomsize = 0;
  this.restart = 0;
  this.player1 = { id: 0, wins: 0, mark: null, loss: 0 };
  this.player2 = { id: 0, wins: 0, mark: null, loss: 0 };
  this.gameboard = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];
  this.lastWinner = null;
  this.gameState = "inProgress";
  this.turn = 0;
};
