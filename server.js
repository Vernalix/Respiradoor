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

// Socket.io connections
io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('joinGame', (player) => {
        players.push({ id: socket.id, ...player });
        io.emit('updatePlayers', players);

        // Start the game automatically when enough players joined (example: 2)
        if(players.length >= 2){
            io.emit('gameStart', players);
        }
    });

    socket.on('disconnect', () => {
        players = players.filter(p => p.id !== socket.id);
        io.emit('updatePlayers', players);
        console.log('Player disconnected:', socket.id);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
