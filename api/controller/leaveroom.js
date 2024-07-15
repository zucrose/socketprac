module.exports = leaveroom = async (data, roomObj, socket, io, roomMap) => {
  socket.leave(data.room);
  if (roomObj[data.room].type == "tictac") {
    console.log(data);
    console.log(roomObj[data.room]);
    if (roomObj[data.room].roomsize == 1)
      roomObj[data.room] = {
        roomsize: -1,
        type: null,
      };
    else {
      let obj = roomObj[data.room].player2;
      if (data.id != roomObj[data.room].player1.id)
        obj = roomObj[data.room].player1;
      roomObj[data.room].player1 = obj;
      roomObj[data.room].player1.mark = "O";
      roomObj[data.room].roomsize = 1;
      roomObj[data.room].turn = 0;
      roomObj[data.room].player2 = { id: 0, wins: 0, mark: null, loss: 0 };
      roomObj[data.room].gameboard = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ];
      if (roomObj[data.room].gameState == "inProgress") {
        roomObj[data.room].gameState = "inProgress";
        roomObj[data.room].winner = obj.id;
      }
    }
  } else if (roomObj[data.room].type == "hangman") {
    //  console.log(roomObj[data.room], "before");
    roomObj[data.room].playerArray = roomObj[data.room].playerArray.filter(
      (ele) => ele.id !== data.id
    );
    roomMap.delete(data.id);
    roomObj[data.room].roomsize--;
    //console.log(roomObj[data.room], "after");
    if (roomObj[data.room].roomsize == 0)
      roomObj[data.room] = {
        roomsize: -1,
        type: null,
      };
  }
  console.log(data.room + "left");
  console.log(roomObj[data.room]);
  io.to(data.room).emit("roomStatus", {
    roomObject: roomObj[data.room],
  });
};
