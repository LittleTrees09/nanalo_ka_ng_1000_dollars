const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");
const noHome = { left: 0, top: 0, init: false };


function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function initNoHome() {
  if (noHome.init) return;

  const container = document.getElementById("card");
  container.style.position = "relative";
  noBtn.style.position = "absolute";

  // Use offsetLeft/offsetTop so the home position is in the card's coordinate system
  noHome.left = noBtn.offsetLeft;
  noHome.top  = noBtn.offsetTop;
  noHome.init = true;
}

function moveNoButton() {
  initNoHome();

  const container = document.getElementById("card");
  const padding = 8;

  const cW = container.clientWidth;
  const cH = container.clientHeight;

  const bW = noBtn.offsetWidth;
  const bH = noBtn.offsetHeight;

  // Max movement from original position (2px as requested)
  const maxMove = 2;

  // Tiny jitter around the original spot (prevents drifting away over time)
  const x = noHome.left + Math.floor(rand(-maxMove, maxMove + 1));
  const y = noHome.top  + Math.floor(rand(-maxMove, maxMove + 1));

  // Clamp so it can never leave the card
  const clampedX = Math.min(Math.max(padding, x), cW - bW - padding);
  const clampedY = Math.min(Math.max(padding, y), cH - bH - padding);

  noBtn.style.left = `${clampedX}px`;
  noBtn.style.top  = `${clampedY}px`;

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
    <h1>YAYYYYY!!!</h1>
    <p class="sub">See you on Valentine’s 💖</p>
    <p style="opacity:.85;margin-top:16px;">(Screenshot this and send it to me 😌)</p>
  `;
});

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton); // mobile fallback

