const socket = io();

const joinButton = document.getElementById('joinButton');
const playerNameInput = document.getElementById('playerName');
const playerColorInput = document.getElementById('playerColor');
const playerShapeInput = document.getElementById('playerShape');
const playerHatInput = document.getElementById('playerHat');
const startGameButton = document.getElementById('startGameButton');
const enterGameplayButton = document.getElementById('enterGameplayButton');

const previewCanvas = document.getElementById('previewCanvas');
const ctx = previewCanvas.getContext('2d');

const lobbyDiv = document.getElementById('lobby');
const gameRoomDiv = document.getElementById('gameRoom');

let isHost = false;
let playerData = {};

// 🎨 draw preview
function drawPreview() {
  ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  const color = playerColorInput.value;
  const shape = playerShapeInput.value;
  const hat = playerHatInput.value;

  ctx.fillStyle = color;
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  const x = 60, y = 60, size = 30;
  ctx.beginPath();

  switch (shape) {
    case 'circle':
      ctx.arc(x, y, size, 0, Math.PI * 2);
      break;
    case 'square':
      ctx.rect(x - size, y - size, size * 2, size * 2);
      break;
    case 'triangle':
      ctx.moveTo(x, y - size);
      ctx.lineTo(x - size, y + size);
      ctx.lineTo(x + size, y + size);
      ctx.closePath();
      break;
    case 'star':
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(x + size * Math.cos((18 + i * 72) * Math.PI / 180),
                   y - size * Math.sin((18 + i * 72) * Math.PI / 180));
        ctx.lineTo(x + (size / 2) * Math.cos((54 + i * 72) * Math.PI / 180),
                   y - (size / 2) * Math.sin((54 + i * 72) * Math.PI / 180));
      }
      ctx.closePath();
      break;
  }

  ctx.fill();
  ctx.stroke();

  // 🧢 hat
  if (hat === 'wizard') ctx.fillText('🧙‍♂️', x - 10, y - 40);
  if (hat === 'crown') ctx.fillText('👑', x - 10, y - 40);
  if (hat === 'cap') ctx.fillText('🧢', x - 10, y - 40);
}

// Update preview on changes
[playerColorInput, playerShapeInput, playerHatInput].forEach(el => {
  el.addEventListener('input', drawPreview);
});
drawPreview();

// Join lobby
joinButton.addEventListener('click', () => {
  const name = playerNameInput.value.trim();
  const color = playerColorInput.value;
  const shape = playerShapeInput.value;
  const hat = playerHatInput.value;

  if (!name) return alert('Enter your name!');
  playerData = { name, color, shape, hat };

  socket.emit('joinGame', playerData);

  joinButton.disabled = true;
  playerNameInput.disabled = true;
  startGameButton.style.display = isHost ? 'inline-block' : 'none';
});

socket.on('youAreHost', () => {
  isHost = true;
  startGameButton.style.display = 'inline-block';
});

socket.on('updatePlayers', (players) => {
  const playerList = document.getElementById('playerList');
  playerList.innerHTML = '';
  players.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('player-card');
    card.style.backgroundColor = p.color;
    card.textContent = p.name;
    if (p.hat !== 'none') {
      const hat = document.createElement('span');
      hat.classList.add('hat');
      hat.textContent = p.hat === 'wizard' ? '🧙‍♂️' :
                        p.hat === 'crown' ? '👑' :
                        p.hat === 'cap' ? '🧢' : '';
      card.appendChild(hat);
    }
    playerList.appendChild(card);
  });
});

startGameButton.addEventListener('click', () => {
  if (isHost) socket.emit('startGame');
});

socket.on('gameStart', (playersInGame) => {
  lobbyDiv.style.display = 'none';
  gameRoomDiv.style.display = 'block';
  const gamePlayersDiv = document.getElementById('gamePlayers');
  gamePlayersDiv.innerHTML = '';
  playersInGame.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('player-card');
    div.style.backgroundColor = p.color;
    div.textContent = p.name;
    gamePlayersDiv.appendChild(div);
  });

  if (isHost) enterGameplayButton.style.display = 'inline-block';
});

enterGameplayButton.addEventListener('click', () => {
  socket.emit('startGameplay');
});

socket.on('gameplayStart', () => {
  gameRoomDiv.style.display = 'none';
  document.getElementById('gameplayRoom').style.display = 'block';
});
