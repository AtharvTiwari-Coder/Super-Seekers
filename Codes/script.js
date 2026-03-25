function startGame() {
  window.location.href = "Game.html";
}

function openSettings() {
  window.location.href = "Settings.html";
}

function exitGame() {
  window.location.href = "https://www.google.com";
}

document.addEventListener("DOMContentLoaded", function() {
  const video = document.getElementById("introVideo");
  const menuContainer = document.getElementById("menuContainer");
  const audio = document.getElementById("bgAudio");
  const toggleBtn = document.getElementById("audioToggle");

  // Audio toggle button logic (only control)
  if (toggleBtn && audio) {
    // Default: muted until user clicks
    audio.muted = true;
    audio.volume = 0;

    toggleBtn.addEventListener("click", () => {
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = 1;
        audio.play().catch(err => {
          console.log("Playback blocked until user gesture:", err);
        });
        toggleBtn.textContent = "🔊"; // sound on
      } else {
        audio.muted = true;
        audio.volume = 0;
        toggleBtn.textContent = "🔇"; // sound off
      }
    });
  }

  if (video) {
    video.removeAttribute("controls");
    video.addEventListener("contextmenu", e => e.preventDefault());

    video.addEventListener("ended", function() {
      video.pause();
      video.currentTime = video.duration;
      if (menuContainer) {
        menuContainer.style.display = "block";
      }
    });
  }
});
