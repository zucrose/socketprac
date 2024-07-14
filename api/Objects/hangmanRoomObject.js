module.exports = function hangman(id, roomsize = 0, roomState = "notStarted") {
  this.type = "hangman";
  this.roomsize = roomsize;
  this.roomState = roomState;
  this.playerArray = [];
  this.scoreUpdated = 0;
  this.currentWord = null;
  this.currentRound = 0;
  this.currentTopic = null;
  this.lastWinner = null;
  this.noOfRounds = 0;
  this.roomID = id;
};
