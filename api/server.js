const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("joinRoom", async (data, callback) => {
    let msg,
      roomsize = 0;
    const sockets = await io.in(data.room).fetchSockets();
    if (sockets.length <= 1) {
      console.log(sockets.length);
      if (sockets.length == 0 && data.create == true) {
        socket.join(data.room);
        msg = "success";
        roomsize = 1;
      } else if (sockets.length == 1 && data.create == false) {
        socket.join(data.room);
        roomsize = 2;
        msg = "success";
      } else msg = "failure";
      console.log(data.room + "joined" + data.create);
    } else {
      console.log("failure");
      msg = "failure";
    }
    console.log(msg);
    callback({
      status: msg,
      roomsize: roomsize,
    });

    io.to(data.room).emit("roomStatus", {
      roomsize: roomsize,
    });
  });
  socket.on("gameEvents", async (data) => {
    const sockets = await io.in(data.room).fetchSockets();
    console.log(data?.playerTimerExpired);
    if (data?.playerTimerExpired) {
      io.to(data.room).emit("roomStatus", {
        roomsize: sockets.length,
        playerTimerExpired: data.playerTimerExpired,
      });
    }
  });
  socket.on("leaveRoom", async (data) => {
    socket.leave(data);
    console.log(data + "left");
  });
  socket.on("sentMessage", (data) => {
    console.log(data.room);
    io.to(data.room).emit("incomingMessage", data.message);
  });
  socket.on("sendMove", (data) => {
    console.log(data);
    io.to(data.room).emit("newMove", data);
  });
});
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("server running at http://localhost:3001");
});
