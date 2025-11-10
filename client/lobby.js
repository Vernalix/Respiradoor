const socket = io();

const joinButton = document.getElementById('joinButton');
const startButton = document.getElementById('startGameButton');
const playerNameInput = document.getElementById('playerName');
const playerColorInput = document.getElementById('playerColor');
const playerHatInput = document.getElementById('playerHat');

const lobbyDiv = document.getElementById('lobby');
const gameRoomDiv = document.getElementById('gameRoom');

const playerListDiv = document.getElementById('playerList');
const gamePlayersDiv = document.getElementById('gamePlayers');

let playerData = {};
let isHost = false;

// Join Lobby
joinButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const color = playerColorInput.value;
    const hat = playerHatInput.value;

    if(!name) return alert("Enter your name!");

    playerData = { name, color, hat };
    socket.emit('joinGame', playerData);
});

// Update Player List
socket.on('updatePlayers', (players) => {
    playerListDiv.innerHTML = '';

    players.forEach(player => {
        const div = document.createElement('div');
        div.classList.add('player-card');
        div.style.backgroundColor = player.color;

        if(player.hat !== 'none'){
            const hatSpan = document.createElement('span');
            hatSpan.classList.add('hat', player.hat);
            div.appendChild(hatSpan);
        }

        const nameSpan = document.createElement('span');
        nameSpan.textContent = player.name;
        div.appendChild(nameSpan);

        playerListDiv.appendChild(div);
    });

    // Host-only Start Button (first player = host)
    if(isHost) {
        startButton.style.display = 'inline-block';
    }
});

// When assigned host
socket.on('youAreHost', () => {
    isHost = true;
    startButton.style.display = 'inline-block';
});

// Start Game
startButton.addEventListener('click', () => {
    socket.emit('startGame');
});

// Enter game room when started
socket.on('gameStart', (playersInGame) => {
    lobbyDiv.style.display = 'none';
    gameRoomDiv.style.display = 'block';

    gamePlayersDiv.innerHTML = '';
    playersInGame.forEach(player => {
        const div = document.createElement('div');
        div.classList.add('player-card');
        div.style.backgroundColor = player.color;

        if(player.hat !== 'none'){
            const hatSpan = document.createElement('span');
            hatSpan.classList.add('hat', player.hat);
            div.appendChild(hatSpan);
        }

        const nameSpan = document.createElement('span');
        nameSpan.textContent = player.name;
        div.appendChild(nameSpan);

        gamePlayersDiv.appendChild(div);
    });
});
