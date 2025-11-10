const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Image();
background.src = '/map.png'; // ✅ Add leading slash for correct path on Render

background.onerror = () => {
  console.error("Map image failed to load. Check if map.png is in /client folder.");
};

socket.on('gameplayStart', () => {
  background.onload = () => {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  };

  // Fallback: if it was already loaded, draw it instantly
  if (background.complete) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  }
});
