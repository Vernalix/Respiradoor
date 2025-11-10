// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from client folder
app.use(express.static(path.join(__dirname, 'client')));

// Store connected players
let players = [];

io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    // When a player joins
    socket.on('joinGame', (playerName) => {
        players.push({ id: socket.id, name: playerName });
        io.emit('updatePlayers', players);
        console.log(players);
    });

    // When a player disconnects
    socket.on('disconnect', () => {
        players = players.filter(p => p.id !== socket.id);
        io.emit('updatePlayers', players);
        console.log('Player disconnected:', socket.id);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

