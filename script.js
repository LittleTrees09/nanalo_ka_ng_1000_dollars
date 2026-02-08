const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ---------------- NO button logic (main page only) ----------------
let noMoveCount = 0;
const NO_MOVE_LIMIT = 2;

// Small, controlled nudge (instead of random teleport)
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function nudgeNoButton(dx) {
  const padding = 16;

  const rect = noBtn.getBoundingClientRect();
  const bw = rect.width;
  const bh = rect.height;

  // If left/top haven't been set yet, start from current rendered position
  const currentLeft = Number.parseFloat(noBtn.style.left);
  const currentTop = Number.parseFloat(noBtn.style.top);
  const x0 = Number.isFinite(currentLeft) ? currentLeft : rect.left;
  const y0 = Number.isFinite(currentTop) ? currentTop : rect.top;

  const minX = padding;
  const maxX = window.innerWidth - bw - padding;
  const minY = padding;
  const maxY = window.innerHeight - bh - padding;

  const x1 = clamp(x0 + dx, minX, maxX);
  const y1 = clamp(y0, minY, maxY);

  noBtn.style.position = "fixed";
  noBtn.style.left = `${x1}px`;
  noBtn.style.top = `${y1}px`;
}

function lockNoButton() {
  noBtn.removeEventListener("mouseenter", onNoHover);
  if (hint) hint.textContent = "Sige, pwede mo na pindutin 😈";
}

function onNoHover() {
  const step = 40; // "few pixels" — adjust to 20–80

  // 1st mouse contact: nudge left
  if (noMoveCount === 0) {
    noMoveCount++;
    nudgeNoButton(-step);
    if (hint) hint.textContent = `Anong kala mo ha 😜 (${noMoveCount}/${NO_MOVE_LIMIT})`;
    return;
  }

  // 2nd mouse contact: nudge right, then stop moving forever
  if (noMoveCount === 1) {
    noMoveCount++;
    nudgeNoButton(+step);
    if (hint) hint.textContent = `Anong kala mo ha 😜 (${noMoveCount}/${NO_MOVE_LIMIT})`;
    lockNoButton();
    return;
  }

  // After 2 moves: do nothing
}

function onNoClick(e) {
  // Before limit: click acts as a "mobile fallback" (counts as a contact)
  if (noMoveCount < NO_MOVE_LIMIT) {
    e.preventDefault();
    onNoHover();
    return;
  }

  // After limit: clicking NO redirects to gorilla page
  window.location.href = "gorilla.html";
}

// ---------------- YES flow (shared) ----------------
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

    // ✅ ensure confetti stays visible above everything (especially on gorilla page)
    c.style.zIndex = "9999";

    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1600);
  }
}

// Global YES flow so gorilla.html can reuse it
window.runYesFlow = function runYesFlow() {
  confettiBurst();

  const successMarkup = `
    <div class="emoji" aria-hidden="true">🥰</div>
    <h1>YAYYYYY~~</h1>
    <p class="sub">See you on Valentine’s 💖</p>
    <p style="opacity:.85;margin-top:16px;">(hihi, pa-send ng screenshot nito, Mahal~ ayayu!!!😌)</p>
  `;

  const card = document.getElementById("card");

  // ✅ index.html behavior: just update the existing card (confetti stays)
  if (card) {
    card.innerHTML = successMarkup;
    return;
  }

  // ✅ gorilla.html behavior: DO NOT wipe body (that kills confetti)
  // Hide the gorilla container if present
  const gorillaWrap = document.querySelector(".gorilla-wrap");
  if (gorillaWrap) gorillaWrap.style.display = "none";

  // Add an overlay card on top
  let overlay = document.getElementById("successOverlay");
  if (!overlay) {
    overlay = document.createElement("main");
    overlay.id = "successOverlay";
    overlay.className = "card";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.margin = "auto";
    overlay.style.height = "fit-content";
    overlay.style.maxWidth = "min(520px, 92vw)";
    overlay.style.zIndex = "9000";
    overlay.style.display = "block";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = successMarkup;
};

// ---------------- One-press YES (pointerdown to avoid "double click") ----------------
function hookYesButtonOnce(btn) {
  if (!btn) return;

  const fireOnce = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (btn.dataset.clicked === "1") return;
    btn.dataset.clicked = "1";

    // Prevent repeat presses without using :disabled (avoids CSS jumps)
    btn.style.pointerEvents = "none";
    btn.blur?.();

    window.runYesFlow();
  };

  // First contact works for mouse + touch
  btn.addEventListener("pointerdown", fireOnce, { once: true });

  // Fallback (some browsers still fire click separately)
  btn.addEventListener("click", fireOnce, { once: true });
}

// Hook YES buttons if present
hookYesButtonOnce(yesBtn);
hookYesButtonOnce(document.getElementById("gorillaYes"));

// Hook NO only on main page
if (noBtn) {
  noBtn.addEventListener("mouseenter", onNoHover);
  noBtn.addEventListener("click", onNoClick);
}
