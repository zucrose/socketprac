const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const sendmoves = require("./controller/sendmoves");
const joinroom = require("./controller/joinroom");
const leaveroom = require("./controller/leaveroom");
const { intiNameSet } = require("./utils/playernameSet");
const hangmanPlayerObject = require("./Objects/hangmanPlayerObject");
const hangmanRoomObject = require("./Objects/hangmanRoomObject");
const tictactoeRoom = require("./Objects/tictactoeRoom");

dotenv.config();

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const roomMap = new Map();
const nameSetArray = [];
intiNameSet(nameSetArray);

var roomObj = [];

for (let i = 0; i < 1000; i++) {
  let obj1 = { roomsize: -1, type: null };
  roomObj.push(obj1);
}
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", async (data, callback) => {
    let obj = await joinroom(data, roomObj, socket, io, roomMap, nameSetArray);
    roomObj = obj.roomObj;
    //console.log(roomObj[data.room]);
    //console.log(obj.msg);
    callback({
      status: obj.msg,
      room: data.room,
    });
  });
  socket.on("startRound", async (data) => {});
  socket.on("timeExpired", async (data) => {
    console.log(data?.playerTimerExpired);
    if (data?.playerTimerExpired) {
      if (roomObj[data.room].player1.id == data.playerTimerExpired) {
        roomObj[data.room].lastWinner = roomObj[data.room].player2.id;
        roomObj[data.room].player2.wins++;
        roomObj[data.room].player1.loss++;
      } else {
        roomObj[data.room].lastWinner = roomObj[data.room].player1.id;
        roomObj[data.room].player1.wins++;
        roomObj[data.room].player2.loss++;
      }
      roomObj[data.room].gameState = "DQ";
      console.log(roomObj[data.room]);
      io.to(data.room).emit("roomStatus", {
        roomObject: roomObj[data.room],
      });
    }
  });

  socket.on("leaveRoom", async (data) => {
    console.log("leaving");
    leaveroom(data, roomObj, socket, io);
    //console.log(roomObj);
  });

  socket.on("sentMessage", (data) => {
    console.log(data.room);
    io.to(data.room).emit("incomingMessage", data.message);
  });

  socket.on("sendMove", (data) => {
    roomObj = sendmoves(data, roomObj, socket, io);
  });

  socket.on("RestartRoom", async (data) => {
    const rsize = await io.in(data.room).fetchSockets();
    roomObj[data.room].restart++;
    if (roomObj[data.room].restart == 2) {
      roomObj[data.room].gameboard = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ];
      roomObj[data.room].gameState = "inProgress";
      roomObj[data.room].lastWinner = null;
      roomObj[data.room].restart = 0;
      roomObj[data.room].turn = 0;
      let temp = roomObj[data.room].player1.mark;
      roomObj[data.room].player1.mark = roomObj[data.room].player2.mark;
      roomObj[data.room].player2.mark = temp;
    }
    console.log(roomObj[data.room]);
    io.to(data.room).emit("roomStatus", {
      roomObject: roomObj[data.room],
    });
  });

  socket.on("declareWinner", async (data) => {
    if (data.state == "tied") {
      roomObj[data.room].lastWinner = null;
      roomObj[data.room].gameState = "Tied";
    } else {
      if (roomObj[data.room].player1.mark == data.mark) {
        roomObj[data.room].lastWinner = roomObj[data.room].player1.id;
        roomObj[data.room].gameState = "Won";
        roomObj[data.room].player1.wins++;
        roomObj[data.room].player2.loss++;
      } else {
        roomObj[data.room].lastWinner = roomObj[data.room].player2.id;
        roomObj[data.room].gameState = "Won";
        roomObj[data.room].player2.wins++;
        roomObj[data.room].player1.loss++;
      }
    }
    io.to(data.room).emit("roomStatus", {
      roomObject: roomObj[data.room],
    });
  });
  socket.on("disconnect", async () => {
    const data = { room: roomMap.get(socket.id) };

    console.log("disconnect", data);
    if (data.room != undefined) leaveroom(data, roomObj, socket, io);
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("server running at http://localhost:3001");
});
