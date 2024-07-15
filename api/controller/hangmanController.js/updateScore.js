const generateTopicAndWord = require("../../utils/generateTopicAndWord");
const StartRound = require("./StartRound");

module.exports = function updateScore(roomObj, data, io, socket) {
  roomObj[data.room].playerArray.forEach((element) => {
    if (element.id === data.id) {
      element.currentScore += data.score;
      roomObj[data.room].scoreUpdated++;
    }
  });
  if (
    roomObj[data.room].scoreUpdated === roomObj[data.room].playerArray.length
  ) {
    if (roomObj[data.room].currentRound < roomObj[data.room].noOfRounds) {
      StartRound(roomObj, { room: data.room, tpye: "nextRound" }, io, socket);
      return;
    } else {
      roomObj[data.room].roomState = "end";
      let mx = 0,
        mxid;
      roomObj[data.room].playerArray.forEach((ele) => {
        if (ele.currentScore > mx) {
          mx = ele.currentScore;
          mxid = ele.id;
        } else if (ele.currentScore == mx) {
          mxid = "tied";
        }
      });
      roomObj[data.room].lastWinner = mxid;
      roomObj[data.room].playerArray.forEach((ele) => {
        if (ele.id == mxid) {
          ele.wins++;
        }
      });
    }
  }

  io.to(data.room).emit("roomStatus", {
    roomObject: roomObj[data.room],
  });

  console.log("update status sent");
};
