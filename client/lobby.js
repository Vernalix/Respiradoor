const socket = io();

const joinButton = document.getElementById('joinButton');
const playerNameInput = document.getElementById('playerName');
const playerColorInput = document.getElementById('playerColor');
const playerHatInput = document.getElementById('playerHat');

const lobbyDiv = document.getElementById('lobby');
const gameRoomDiv = document.getElementById('gameRoom');

const playerListDiv = document.getElementById('playerList');
const gamePlayersDiv = document.getElementById('gamePlayers');

let playerData = {};

// Join Game
joinButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const color = playerColorInput.value;
    const hat = playerHatInput.value;

    if(!name) return alert("Enter your name!");

    playerData = { name, color, hat };
    socket.emit('joinGame', playerData);

    // Disable inputs
    joinButton.disabled = true;
    playerNameInput.disabled = true;
    playerColorInput.disabled = true;
    playerHatInput.disabled = true;
});

// Update Lobby Player List
socket.on('updatePlayers', (players) => {
    playerListDiv.innerHTML = '';
    players.forEach(player => {
        const div = document.createElement('div');
        div.classList.add('player-card');
        div.style.backgroundColor = player.color;

        // Hat display
        if(player.hat !== 'none'){
            const hatSpan = document.createElement('span');
            hatSpan.classList.add('hat');
            hatSpan.textContent = '🎩';
            div.appendChild(hatSpan);
        }

        const nameSpan = document.createElement('span');
        nameSpan.textContent = player.name;
        div.appendChild(nameSpan);

        playerListDiv.appendChild(div);
    });
});

// Listen for Game Start (enter separate room)
socket.on('gameStart', (playersInGame) => {
    lobbyDiv.style.display = 'none';
    gameRoomDiv.style.display = 'block';

    // Show players in game room
    gamePlayersDiv.innerHTML = '';
    playersInGame.forEach(player => {
        const div = document.createElement('div');
        div.classList.add('player-card');
        div.style.backgroundColor = player.color;

        if(player.hat !== 'none'){
            const hatSpan = document.createElement('span');
            hatSpan.classList.add('hat');
            hatSpan.textContent = '🎩';
            div.appendChild(hatSpan);
        }

        const nameSpan = document.createElement('span');
        nameSpan.textContent = player.name;
        div.appendChild(nameSpan);

        gamePlayersDiv.appendChild(div);
    });
});
