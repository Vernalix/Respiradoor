const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Placeholder: Draw players (in future this will be synced by sockets)
function drawPlayer(x, y, color, name) {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(name, x - 20, y + 45);
}

socket.on('gameplayStart', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Example placeholder player
    drawPlayer(200, 200, 'blue', 'Host');
});
