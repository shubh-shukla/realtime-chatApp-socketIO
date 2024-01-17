import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected with id: " + socket.id);
  socket.emit("welcome", "Welcome to the server");
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", {
      senderId: socket.id,
      text: msg,
    });
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
