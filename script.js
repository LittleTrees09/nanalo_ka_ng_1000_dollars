const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

let noMoveCount = 0;
const NO_MOVE_LIMIT = 2;

function moveNoButton() {
  // Move within viewport bounds
  const padding = 16;
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = window.innerWidth - btnRect.width - padding;
  const maxY = window.innerHeight - btnRect.height - padding;

  const x = rand(padding, Math.max(padding, maxX));
  const y = rand(padding, Math.max(padding, maxY));

  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function lockNoButton() {
  // Stop dodging; allow pressing.
  noBtn.removeEventListener("mouseenter", onNoHover);
  hint.textContent = "Sige, pwede mo na pindutin 😈";
}

function onNoHover() {
  if (noMoveCount < NO_MOVE_LIMIT) {
    noMoveCount++;
    moveNoButton();
    hint.textContent = `Anong kala mo ha 😜 (${noMoveCount}/${NO_MOVE_LIMIT})`;

    if (noMoveCount === NO_MOVE_LIMIT) {
      lockNoButton();
    }
  }
}

function onNoClick(e) {
  // Before limit: click acts as a "mobile fallback" dodge
  if (noMoveCount < NO_MOVE_LIMIT) {
    e.preventDefault();
    onNoHover();
    return;
  }

  // After limit: clicking NO redirects to gorilla page
  window.location.href = "gorilla.html";
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
    <h1>YAYYYYY~~</h1>
    <p class="sub">See you on Valentine’s 💖</p>
    <p style="opacity:.85;margin-top:16px;">(hihi, pa-send ng screenshot nito, Mahal~ ayayu!!!😌)</p>
  `;
});

noBtn.addEventListener("mouseenter", onNoHover);
noBtn.addEventListener("click", onNoClick);
