/* Basic navigation functions (replace with your real pages) */
function startGame() {
  // navigate to game page
  window.location.href = "Game.html";
}
function openSettings() {
  window.location.href = "Settings.html";
}
function exitGame() {
  // example: go to a safe external page or close
  window.location.href = "https://www.google.com";
}

/* Main UI + audio handling */
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("introVideo");
  const menuContainer = document.getElementById("menuContainer");
  const audio = document.getElementById("bgAudio");
  const toggleBtn = document.getElementById("audioToggle");

  /* --- Audio toggle with persistence --- */
  const AUDIO_KEY = "superseekers_audio_muted";

  function updateToggleIcon(isMuted) {
    toggleBtn.textContent = isMuted ? "🔇" : "🔊";
    toggleBtn.setAttribute("aria-pressed", String(!isMuted));
  }

  function setAudioMuted(muted) {
    if (!audio) return;
    audio.muted = muted;
    audio.volume = muted ? 0 : 1;
    localStorage.setItem(AUDIO_KEY, muted ? "1" : "0");
    updateToggleIcon(muted);
  }

  // Initialize toggle state from localStorage (default: unmuted)
  const saved = localStorage.getItem(AUDIO_KEY);
  const startMuted = saved === "1";
  if (audio) {
    audio.loop = true;
    audio.preload = "auto";
    audio.muted = startMuted;
    audio.volume = startMuted ? 0 : 1;
  }
  updateToggleIcon(startMuted);

  // Toggle button handler
  toggleBtn.addEventListener("click", () => {
    const isMuted = audio ? audio.muted || audio.volume === 0 : true;
    setAudioMuted(!isMuted);

    // If unmuting, ensure audio plays (user gesture)
    if (!audio.muted) {
      audio.play().catch(() => {
        // If still blocked, rely on user gesture next time
      });
    }
  });

  /* --- Robust autoplay attempt (muted fade-in + synthetic click fallback) --- */
  function tryStartAudioWithFade() {
    if (!audio) return;
    // If user previously muted, don't force unmute
    if (audio.muted || audio.volume === 0) {
      // still attempt to play muted so browser unlocks playback
      audio.play().catch(() => {});
      return;
    }

    audio.volume = 0;
    audio.muted = false;
    audio.play().then(() => {
      let vol = 0;
      const step = 0.05;
      const interval = 150;
      const fade = setInterval(() => {
        vol = Math.min(1, vol + step);
        audio.volume = vol;
        if (vol >= 1) clearInterval(fade);
      }, interval);
    }).catch(() => {
      // autoplay blocked; we'll rely on user gesture
    });
  }

  // Try a synthetic click to unlock audio on some browsers
  setTimeout(() => {
    try {
      const fakeClick = new MouseEvent("click", { bubbles: true, cancelable: true });
      document.body.dispatchEvent(fakeClick);
      tryStartAudioWithFade();
    } catch (e) {
      tryStartAudioWithFade();
    }
  }, 250);

  // Ensure audio starts on first real user interaction if blocked
  function userGestureStart() {
    if (!audio) return;
    // If user had muted intentionally, respect that
    const savedMuted = localStorage.getItem(AUDIO_KEY) === "1";
    if (savedMuted) {
      audio.muted = true;
      audio.volume = 0;
      updateToggleIcon(true);
      return;
    }
    audio.muted = false;
    audio.volume = 1;
    audio.play().catch(() => {});
    updateToggleIcon(false);
  }
  document.body.addEventListener("click", userGestureStart, { once: true, passive: true });

  /* --- Video end handling: freeze slightly before last frame to avoid white flash --- */
  if (video) {
    // Ensure controls are not present
    video.removeAttribute("controls");
    video.addEventListener("contextmenu", (e) => e.preventDefault());

    // When video ends, freeze just before the final frame and show menu
    video.addEventListener("ended", function () {
      // Freeze at a tiny offset before the absolute end to avoid a white last frame
      try {
        const offset = 0.05; // 50ms before end; adjust down to 0.01 if needed
        const target = Math.max(0, video.duration - offset);
        video.pause();
        video.currentTime = target;
      } catch (err) {
        // fallback: just pause
        video.pause();
      }

      // Reveal menu
      if (menuContainer) {
        menuContainer.style.display = "flex";
        menuContainer.setAttribute("aria-hidden", "false");
      }

      // Try to start audio when intro finishes (user gesture fallback)
      tryStartAudioWithFade();
    });

    // If video is already ended (rare), show menu
    if (video.readyState >= 2 && video.ended) {
      menuContainer.style.display = "flex";
      menuContainer.setAttribute("aria-hidden", "false");
    }
  } else {
    // If no video, show menu immediately
    if (menuContainer) {
      menuContainer.style.display = "flex";
      menuContainer.setAttribute("aria-hidden", "false");
    }
  }
});
