const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// ✅ Serve client folder
app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

let rooms = {}; // Stores all rooms

io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  socket.on("createRoom", (username) => {
    const roomCode = Math.floor(1000 + Math.random() * 9000); // 4-digit room
    rooms[roomCode] = {
      host: socket.id,
      players: [{ id: socket.id, name: username, score: 0 }]
    };
    socket.join(roomCode);
    io.to(socket.id).emit("roomCreated", roomCode);
    console.log(`Room ${roomCode} created by ${username}`);
  });

  socket.on("joinRoom", ({ username, roomCode }) => {
    const room = rooms[roomCode];
    if (room) {
      room.players.push({ id: socket.id, name: username, score: 0 });
      socket.join(roomCode);
      io.to(roomCode).emit("updateLobby", room.players);
    } else {
      socket.emit("errorMessage", "Room not found!");
    }
  });

  socket.on("startGame", (roomCode) => {
    const room = rooms[roomCode];
    if (room && socket.id === room.host) {
      io.to(roomCode).emit("gameStart", room.players);
    }
  });

  socket.on("disconnect", () => {
    for (const code in rooms) {
      const room = rooms[code];
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) {
        delete rooms[code];
      } else {
        io.to(code).emit("updateLobby", room.players);
      }
    }
  });
});

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
