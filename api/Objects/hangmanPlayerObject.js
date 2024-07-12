const { playerNameGenerator } = require("../utils/playernameSet");

module.exports = function hangmanPlayer(roomid, nameSetArray, id) {
  this.currentScore = 0;
  this.wins = 0;
  this.roomid = roomid;
  this.loss = 0;
  this.id = id;
  this.pname = playerNameGenerator(roomid, nameSetArray);
  this.roomowner = false;
};
