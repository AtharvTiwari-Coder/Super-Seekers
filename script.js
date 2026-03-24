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

  // Try to start audio muted + fade in
  if (audio) {
    audio.volume = 0;
    audio.muted = false;
    audio.loop = true;

    audio.play().then(() => {
      let vol = 0;
      const fade = setInterval(() => {
        if (vol < 1) {
          vol += 0.05;
          audio.volume = vol;
        } else {
          clearInterval(fade);
        }
      }, 200);
    }).catch(err => {
      console.log("Autoplay blocked:", err);
    });
  }

  // Toggle mute/unmute with button
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = 1;
        toggleBtn.textContent = "🔊"; // sound on
      } else {
        audio.muted = true;
        toggleBtn.textContent = "🔇"; // sound off
      }
    });
  }

  // Handle video ending
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
