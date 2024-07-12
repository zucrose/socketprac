module.exports = function hangman(roomsize = 0, roomState = "notStarted") {
  this.type = "hangman";
  this.roomsize = roomsize;
  this.roomState = roomState;
  this.playerArray = [];
  this.currentWord = null;
  this.lastWinner = null;
  this.noOfRounds = 0;
};
