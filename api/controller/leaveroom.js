module.exports = leaveroom = async (data, roomObj, socket, io) => {
  socket.leave(data.room);
  if (roomObj[data.room].roomsize == 1)
    roomObj[data.room] = {
      roomsize: 0,
      restart: 0,
      player1: { id: 0, wins: 0, mark: null, loss: 0 },
      player2: { id: 0, wins: 0, mark: null, loss: 0 },
      gameboard: [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ],
      lastWinner: null,
      gameState: "inProgress",
      turn: 0,
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

  console.log(data.room + "left");
  console.log(roomObj[data.room]);
  io.to(data.room).emit("roomStatus", {
    roomObject: roomObj[data.room],
  });
};
