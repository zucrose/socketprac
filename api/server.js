const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: " http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("joinRoom", async (data) => {
    const sockets = await io.in(data).fetchSockets();
    if (sockets.length <= 1) {
      socket.join(data);
      console.log(data + "joined");
    } else console.log("failed");
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
server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
