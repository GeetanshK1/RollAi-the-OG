import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import client from "./src/redisClient.js";
import { handelSocketConnection } from "./src/socketRoutes.js";
import 'dotenv/config'

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
})

client.connect()
  .then(() => console.log("database connected"))
  .catch(err => console.log("error connecting db", err))

io.on("connection", (socket) => {
  handelSocketConnection(io, socket)
})

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});