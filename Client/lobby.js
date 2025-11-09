// lobby.js
const socket = io();

// Elements
const startButton = document.getElementById('startButton');
const playerNameInput = document.getElementById('playerName');
const playerList = document.createElement('ul');
document.body.appendChild(playerList);

// Join game
startButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
        socket.emit('joinGame', name);
        alert(`Welcome, ${name}! Waiting for other players...`);
    }
});

// Update player list
socket.on('updatePlayers', (players) => {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name;
        playerList.appendChild(li);
    });
});

