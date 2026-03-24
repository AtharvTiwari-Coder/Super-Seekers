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

  // Simulate a click after load to unlock audio
  setTimeout(() => {
    const fakeClick = new MouseEvent("click", { bubbles: true, cancelable: true });
    document.body.dispatchEvent(fakeClick);

    if (audio) {
      audio.volume = 0;
      audio.muted = false;
      audio.loop = true;
      audio.play().then(() => {
        console.log("Background audio started automatically.");
        // Smooth fade-in
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
        console.log("Autoplay blocked: ", err);
      });
    }
  }, 300); // slight delay so page is ready

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
