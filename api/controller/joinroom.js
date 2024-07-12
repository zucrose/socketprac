const hangmanPlayerObject = require("../Objects/hangmanPlayerObject");
const hangmanRoomObject = require("../Objects/hangmanRoomObject");
const tictactoeRoom = require("../Objects/tictactoeRoom");

module.exports = joinroom = async (
  data,
  roomObj,
  socket,
  io,
  roomMap,
  nameSetArray
) => {
  let msg;
  //Creating a random room if data.room is -1 which is sent when we click on createroom
  if (data.room === -1) {
    data.room = Math.floor(Math.random() * 1000);
    while (roomObj[data.room].roomsize != -1)
      data.room = Math.floor(Math.random() * 1000);
  }
  console.log(data);
  if (
    data.type == "tictac" &&
    (roomObj[data.room].type == "tictac" || roomObj[data.room].type == null)
  ) {
    if (data.room <= 1000 && roomObj[data.room].roomsize < 2) {
      if (roomObj[data.room].roomsize === -1 && data.create == true) {
        let obj1 = new tictactoeRoom();
        roomObj[data.room] = obj1;
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
    } else {
      //roomsize>2 thus room is full
      msg = "failure";
    }
  } else if (
    data.type == "hangman" &&
    (roomObj[data.room].type == "hangman" || roomObj[data.room].type == null)
  ) {
    //create an empty hangman object if the array doesnt have any other elements
    if (roomObj[data.room].roomsize === -1) {
      let obj1 = new hangmanRoomObject();
      roomObj[data.room] = obj1;
    }
    socket.join(data.room);
    msg = "success";
    let player = new hangmanPlayerObject(data.room, nameSetArray, data.id);
    roomObj[data.room].playerArray.push(player);
    roomObj[data.room].roomsize++;
    roomMap.set(data.id, data.room);
    // console.log(roomObj[data.room]);
  }
  if (msg == "success") {
    console.log("hgjgjgjh", roomObj[data.room]);
    io.to(data.room).emit("roomStatus", {
      roomObject: roomObj[data.room],
    });
    console.log("status sent");
  }
  return { msg: msg, roomObj: roomObj };
};
