const video = document.getElementById("introVideo");
const audio = document.getElementById("bgAudio");
const audioToggle = document.getElementById("audioToggle");
const menuContainer = document.getElementById("menuContainer");

video.onended = () => {
  menuContainer.style.display = "block";
};

// Start/stop audio only when button is clicked
audioToggle.onclick = () => {
  if (audio.paused) {
    audio.play();
    audioToggle.textContent = "🔊";
  } else {
    audio.pause();
    audioToggle.textContent = "🔇";
  }
};

function startGame() {
  window.location.href = "Game/Game.html";
}

function openSettings() {
  window.location.href = "Settings/Settings.html";
}

function exitGame() {
  window.location.href = "https://www.google.com";
}
