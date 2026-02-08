const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

// ✅ Google Apps Script Web App endpoint
const GOOGLE_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyWtPAc3mecrppjrJTgoCfW9DdpyMlWe2C-5TubC9aweU4JMjaL8OZghe0YGXKcjfYKgA/exec";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ---------------- NO button logic (main page only) ----------------
let noMoveCount = 0;
const NO_MOVE_LIMIT = 2;

// Small, controlled nudge
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function nudgeNoButton(dx) {
  const padding = 16;

  const rect = noBtn.getBoundingClientRect();
  const bw = rect.width;
  const bh = rect.height;

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
  const step = 40;

  if (noMoveCount === 0) {
    noMoveCount++;
    nudgeNoButton(-step);
    if (hint) hint.textContent = `Anong kala mo ha 😜 (${noMoveCount}/${NO_MOVE_LIMIT})`;
    return;
  }

  if (noMoveCount === 1) {
    noMoveCount++;
    nudgeNoButton(+step);
    if (hint) hint.textContent = `Anong kala mo ha 😜 (${noMoveCount}/${NO_MOVE_LIMIT})`;
    lockNoButton();
    return;
  }
}

function onNoClick(e) {
  if (noMoveCount < NO_MOVE_LIMIT) {
    e.preventDefault();
    onNoHover();
    return;
  }
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
    c.style.zIndex = "9999";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1600);
  }
}

function buildMoviePickerMarkup() {
  const movies = [
    "insert movie 1",
    "insert movie 2",
    "insert movie 3",
    "insert movie 4",
    "insert movie 5",
  ];

  const options = movies
    .map(
      (m) => `
      <label class="movie-option">
        <input type="radio" name="movie" value="${m}">
        <span>${m}</span>
      </label>`
    )
    .join("");

  return `
    <section class="movie-card">
      <h2 class="movie-title">Pick one movie 🎬</h2>
      <p class="movie-sub">One choice only ha 😈</p>

      <form id="movieForm" class="movie-form">
        ${options}
        <button class="btn yes" type="submit" style="margin-top:12px;">Submit</button>
        <p class="hint" id="movieHint" style="margin-top:10px;"></p>
      </form>
    </section>
  `;
}

window.runYesFlow = function runYesFlow() {
  confettiBurst();

  const successMarkup = `
    <div class="emoji" aria-hidden="true">🥰</div>
    <h1>YAYYYYY~~</h1>
    <p class="sub">See you on Valentine’s 💖</p>
    <p style="opacity:.85;margin-top:16px;">(hihi, pa-send ng screenshot nito, Mahal~ ayayu!!!😌)</p>
  `;

  const card = document.getElementById("card");

  if (card) {
    card.innerHTML = successMarkup + buildMoviePickerMarkup();
    return;
  }

  const gorillaWrap = document.querySelector(".gorilla-wrap");
  if (gorillaWrap) gorillaWrap.style.display = "none";

  let overlay = document.getElementById("successOverlay");
  if (!overlay) {
    overlay = document.createElement("main");
    overlay.id = "successOverlay";
    overlay.className = "card";
    overlay.style.position = "fixed";
    overlay.style.left = "50%";
    overlay.style.top = "45%";
    overlay.style.transform = "translate(-50%, -50%)";
    overlay.style.zIndex = "9000";
    overlay.style.width = "min(520px, 92vw)";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = successMarkup + buildMoviePickerMarkup();
};

// ---------------- One-press YES (pointerdown) ----------------
function hookYesButtonOnce(btn) {
  if (!btn) return;

  const fireOnce = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (btn.dataset.clicked === "1") return;
    btn.dataset.clicked = "1";

    btn.style.pointerEvents = "none";
    btn.blur?.();

    window.runYesFlow();
  };

  btn.addEventListener("pointerdown", fireOnce, { once: true });
  btn.addEventListener("click", fireOnce, { once: true });
}

hookYesButtonOnce(yesBtn);
hookYesButtonOnce(document.getElementById("gorillaYes"));

if (noBtn) {
  noBtn.addEventListener("mouseenter", onNoHover);
  noBtn.addEventListener("click", onNoClick);
}

// ---------------- Save movie choice to Google Sheets (JSONP, works on GitHub) ----------------
function saveMovieJSONP(movie, onDone) {
  const cbName = `__movieCB_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

  // callback called by Apps Script
  window[cbName] = (data) => {
    try { onDone(null, data); } finally {
      delete window[cbName];
      script.remove();
    }
  };

  const script = document.createElement("script");
  const url =
    `${GOOGLE_ENDPOINT}?movie=${encodeURIComponent(movie)}&callback=${encodeURIComponent(cbName)}`;

  script.src = url;
  script.onerror = () => {
    delete window[cbName];
    script.remove();
    onDone(new Error("JSONP load failed"), null);
  };

  document.body.appendChild(script);
}

document.addEventListener("submit", (e) => {
  if (e.target?.id !== "movieForm") return;
  e.preventDefault();

  const form = e.target;
  const movieHint = document.getElementById("movieHint");
  const picked = form.querySelector('input[name="movie"]:checked');

  if (!picked) {
    if (movieHint) movieHint.textContent = "Pick one movie first 🙂";
    return;
  }

  if (form.dataset.submitted === "1") return;
  form.dataset.submitted = "1";
  form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));

  saveMovieJSONP(picked.value, (err, data) => {
    if (err) {
      if (movieHint) movieHint.textContent = "Not saved: endpoint error.";
      form.dataset.submitted = "0";
      form.querySelectorAll("input, button").forEach((el) => (el.disabled = false));
      return;
    }

    if (data && data.ok === true) {
      if (movieHint) movieHint.textContent = `Saved! You picked: ${picked.value} 💖`;
      return;
    }

    if (movieHint) movieHint.textContent = `Not saved: ${data?.error || "unknown error"}`;
    form.dataset.submitted = "0";
    form.querySelectorAll("input, button").forEach((el) => (el.disabled = false));
  });
});

