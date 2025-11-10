const socket = io();
const usernameInput = document.getElementById("username");
const createBtn = document.getElementById("createRoom");
const joinBtn = document.getElementById("joinRoom");

if (createBtn) {
  createBtn.onclick = () => {
    const username = usernameInput.value.trim();
    if (!username) return alert("Enter a name!");
    socket.emit("createRoom", username);
  };
}

if (joinBtn) {
  joinBtn.onclick = () => {
    const username = usernameInput.value.trim();
    const roomCode = document.getElementById("roomCode").value.trim();
    if (!username || !roomCode) return alert("Enter name and room code!");
    socket.emit("joinRoom", { username, roomCode });
  };
}

socket.on("roomCreated", (roomCode) => {
  localStorage.setItem("roomCode", roomCode);
  window.location.href = "lobby.html";
});

socket.on("updateLobby", (players) => {
  const list = document.getElementById("playerList");
  if (list) {
    list.innerHTML = players.map(p => `<li>${p.name}</li>`).join("");
  }
});

socket.on("gameStart", () => {
  window.location.href = "game.html";
});

socket.on("errorMessage", (msg) => alert(msg));

window.onload = () => {
  const codeDisplay = document.getElementById("roomCodeDisplay");
  if (codeDisplay) codeDisplay.textContent = localStorage.getItem("roomCode");

  const startBtn = document.getElementById("startGameBtn");
  if (startBtn) {
    startBtn.style.display = "block";
    startBtn.onclick = () => {
      socket.emit("startGame", localStorage.getItem("roomCode"));
    };
  }
};
