const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// ✅ Fix: serve static files properly
const clientPath = path.join(__dirname, 'client');
app.use(express.static(clientPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

let players = [];
let hostId = null;

io.on('connection', (socket) => {
  socket.on('joinGame', (player) => {
    players.push({ id: socket.id, ...player });

    if (!hostId) {
      hostId = socket.id;
      io.to(hostId).emit('youAreHost');
    }

    io.emit('updatePlayers', players);
  });

  socket.on('startGame', () => {
    if (socket.id === hostId) io.emit('gameStart', players);
  });

  socket.on('startGameplay', () => {
    if (socket.id === hostId) io.emit('gameplayStart');
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    if (socket.id === hostId) {
      hostId = players.length ? players[0].id : null;
      if (hostId) io.to(hostId).emit('youAreHost');
    }
    io.emit('updatePlayers', players);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
