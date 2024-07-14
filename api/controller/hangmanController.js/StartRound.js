const generateTopicAndWord = require("../../utils/generateTopicAndWord");

module.exports = function startRound(roomObj, data, io, socket) {
  if (data.type == "start") {
    console.log(data, roomObj[data.room]);
    roomObj[data.room].roomState = "started";
    roomObj[data.room].noOfRounds = data.rounds;
  }
  roomObj[data.room].scoreUpdated = 0;
  generateTopicAndWord(data, roomObj);
  io.to(data.room).emit("roomStatus", {
    roomObject: roomObj[data.room],
  });
  console.log("start round status sent");
};
