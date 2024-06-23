module.exports = joinroom = async (data, roomObj, socket, io, roomMap) => {
  let msg;
  //Creating a random room if data.room is -1 which is sent when we click on createroom
  if (data.room === -1) {
    data.room = Math.floor(Math.random() * 1000);
    while (roomObj[data.room].roomsize != 0)
      data.room = Math.floor(Math.random() * 1000);
  }

  if (data.room <= 1000 && roomObj[data.room].roomsize < 2) {
    if (roomObj[data.room].roomsize === 0 && data.create == true) {
      //set player1 in roomob to socket id of first person
      socket.join(data.room);
      msg = "success";

      const socketsArr = await io.in(data.room).fetchSockets();
      roomObj[data.room].roomsize++;
      roomObj[data.room].player1 = {
        id: socketsArr[0].id,
        wins: 0,
        mark: "O",
        loss: 0,
      };
      roomMap.set(socketsArr[0].id, data.room);
    } else if (roomObj[data.room].roomsize === 1 && data.create == false) {
      //set player 2 in roomobj to socket id of second person
      socket.join(data.room);

      msg = "success";
      const socketsArr = await io.in(data.room).fetchSockets();
      socketsArr.forEach((sock) => console.log("sock:", sock.id));
      roomObj[data.room].roomsize++;
      roomObj[data.room].player2 = {
        id: socketsArr[1].id,
        wins: 0,
        mark: "X",
        loss: 0,
      };
      roomMap.set(socketsArr[1].id, data.room);
    } else msg = "failure";
    console.log(data.room + "joined" + data.create);
    io.to(data.room).emit("roomStatus", {
      roomObject: roomObj[data.room],
    });
  } else {
    //roomsize>2 thus room is full
    msg = "failure";
  }
  return { msg: msg, roomObj: roomObj };
};
