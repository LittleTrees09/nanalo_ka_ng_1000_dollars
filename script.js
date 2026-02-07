const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");
const noHome = { left: 0, top: 0, init: false };


function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const noHome = { left: 0, top: 0, init: false };

function initNoHome() {
  if (noHome.init) return;

  const container = document.getElementById("card");
  container.style.position = "relative";

  // Ensure No is absolutely positioned inside the card
  noBtn.style.position = "absolute";

  // Record original position in card coords
  noHome.left = noBtn.offsetLeft;
  noHome.top  = noBtn.offsetTop;

  noHome.init = true;
}

function rectsOverlap(a, b) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

function moveNoButton() {
  initNoHome();

  const container = document.getElementById("card");
  const padding = 8;

  // How far No is allowed to move from its original spot
  const maxMove = 20; // set to 2 if you truly want tiny movement

  const cW = container.clientWidth;
  const cH = container.clientHeight;

  const noW = noBtn.offsetWidth;
  const noH = noBtn.offsetHeight;

  // We'll try a bunch of random jitters and pick one that doesn't overlap Yes
  for (let i = 0; i < 60; i++) {
    const x = noHome.left + Math.floor(rand(-maxMove, maxMove + 1));
    const y = noHome.top  + Math.floor(rand(-maxMove, maxMove + 1));

    // Clamp to card so it can't leave the card
    const clampedX = Math.min(Math.max(padding, x), cW - noW - padding);
    const clampedY = Math.min(Math.max(padding, y), cH - noH - padding);

    // Apply temporarily
    noBtn.style.left = `${clampedX}px`;
    noBtn.style.top  = `${clampedY}px`;

    // Now measure overlap in viewport coords (reliable)
    const noRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    // Add a small safety gap so they don't touch
    const gap = 6;
    const noRectWithGap = {
      left: noRect.left - gap,
      right: noRect.right + gap,
      top: noRect.top - gap,
      bottom: noRect.bottom + gap
    };

    if (!rectsOverlap(noRectWithGap, yesRect)) {
      hint.textContent = "😛💩🤡";
      return; // success
    }
  }

  // If we can't find a valid spot (rare), reset to home
  noBtn.style.left = `${noHome.left}px`;
  noBtn.style.top = `${noHome.top}px`;
  hint.textContent = "😛💩🤡";
}

///   hint.textContent = "😛💩🤡";

function confettiBurst(count = 120) {
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = `${rand(0, 100)}vw`;
    c.style.animationDelay = `${rand(0, 300)}ms`;
    c.style.background = `hsl(${Math.floor(rand(0, 360))} 90% 60%)`;
    c.style.transform = `rotate(${rand(0, 360)}deg)`;
    c.style.width = `${rand(6, 12)}px`;
    c.style.height = `${rand(8, 16)}px`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1600);
  }
}

yesBtn.addEventListener("click", () => {
  confettiBurst();
  document.getElementById("card").innerHTML = `
    <div class="emoji" aria-hidden="true">🥰</div>
    <h1>YAYYYYY~~</h1>
    <p class="sub">See you on Valentine’s 💖</p>
    <p style="opacity:.85;margin-top:16px;">(Hihi, pa-send ng screenshot nito sakin~ ayayu!! 😌)</p>
  `;
});

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton); // mobile fallback

