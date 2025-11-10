const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let background = new Image();
background.src = 'map.png'; // Make sure this file exists in /client/

socket.on('gameplayStart', () => {
  background.onload = () => {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  };
});
