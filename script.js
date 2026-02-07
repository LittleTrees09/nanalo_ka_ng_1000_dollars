const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function moveNoButton() {
  const container = document.getElementById("card");
  const padding = 12;

  noBtn.style.position = "absolute";

  // Initialize start position once
  if (!start.initialized) {
    const cRect = container.getBoundingClientRect();
    const bRect = noBtn.getBoundingClientRect();
    start.left = bRect.left - cRect.left;
    start.top  = bRect.top  - cRect.top;
    start.initialized = true;
  }

  const cRect = container.getBoundingClientRect();
  const bRect = noBtn.getBoundingClientRect();

  const maxX = cRect.width - bRect.width - padding;
  const maxY = cRect.height - bRect.height - padding;

  const radius = 90; // adjust: smaller = tighter movement

  const x = Math.min(
    Math.max(start.left + rand(-radius, radius), padding),
    Math.max(padding, maxX)
  );

  const y = Math.min(
    Math.max(start.top + rand(-radius, radius), padding),
    Math.max(padding, maxY)
  );

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  hint.textContent = "Nice try 😄";
}


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

