module.exports = function sendmoves(data, roomObj, socket, io) {
  console.log(data);
  roomObj[data.room].gameboard[data.movex][data.movey] = data.sender;
  roomObj[data.room].turn++;
  console.log(roomObj[data.room]);
  io.to(data.room).emit("roomStatus", {
    roomObject: roomObj[data.room],
  });
  return roomObj;
};
