const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'client')));
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'client','index.html'));
});

let players = [];
let hostId = null;

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('joinGame', (player) => {
        players.push({ id: socket.id, ...player });

        // Assign first player as host
        if (!hostId) {
            hostId = socket.id;
            io.to(hostId).emit('youAreHost');
            console.log('Host assigned:', hostId);
        }

        io.emit('updatePlayers', players);
    });

    socket.on('startGame', () => {
        if (socket.id === hostId) {
            io.emit('gameStart', players);
            console.log('Game started by host!');
        }
    });

    socket.on('disconnect', () => {
        players = players.filter(p => p.id !== socket.id);
        if (socket.id === hostId) {
            hostId = players.length ? players[0].id : null;
            if (hostId) io.to(hostId).emit('youAreHost');
        }
        io.emit('updatePlayers', players);
        console.log('Player disconnected:', socket.id);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
