// lobby.js
const socket = io();

// Elements
const joinButton = document.getElementById('joinButton');
const playerNameInput = document.getElementById('playerName');
const playerColorInput = document.getElementById('playerColor');
const playerList = document.getElementById('playerList');
const timerText = document.getElementById('timerText');
const lobbyDiv = document.getElementById('lobby');
const gameArea = document.getElementById('gameArea');

let playerData = {};

// Join Lobby
joinButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const color = playerColorInput.value;

    if (!name) {
        alert("Please enter your name!");
        return;
    }

    playerData = { name, color };
    socket.emit('joinGame', playerData);

    joinButton.disabled = true;
    playerNameInput.disabled = true;
    playerColorInput.disabled = true;
});

// Update Player List
socket.on('updatePlayers', (players) => {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name;
        li.style.color = player.color;
        playerList.appendChild(li);
    });

    // Start timer when enough players (example: 2)
    if(players.length >= 2) {
        startCountdown(5); // 5-second countdown
    }
});

// Countdown Timer
let countdownInterval;
function startCountdown(seconds) {
    clearInterval(countdownInterval);
    timerText.textContent = `Game starts in ${seconds} seconds...`;

    countdownInterval = setInterval(() => {
        seconds--;
        if(seconds > 0){
            timerText.textContent = `Game starts in ${seconds} seconds...`;
        } else {
            clearInterval(countdownInterval);
            timerText.textContent = "Game Started!";
            lobbyDiv.style.display = 'none';
            gameArea.style.display = 'block';
            socket.emit('gameStart');
        }
    }, 1000);
}

// Game start event (optional logic for future)
socket.on('gameStart', () => {
    lobbyDiv.style.display = 'none';
    gameArea.style.display = 'block';
});
