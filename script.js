const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function moveNoButton() {
  const area = document.querySelector(".buttons"); // movement area
  const padding = 10;

  // Make No button move inside the area box
  noBtn.style.position = "absolute";

  const areaRect = area.getBoundingClientRect();

  // Ensure layout has applied absolute positioning context
  const yesRectV = yesBtn.getBoundingClientRect();
  const noRectV = noBtn.getBoundingClientRect();

  // Size (use current rendered size)
  const noW = noRectV.width;
  const noH = noRectV.height;

  // Helper: check overlap between two rects in "area-local" coordinates
  function overlaps(ax, ay, aw, ah, bx, by, bw, bh) {
    return !(ax + aw <= bx || bx + bw <= ax || ay + ah <= by || by + bh <= ay);
  }

  // Yes button rectangle in area-local coords
  const yesX = yesRectV.left - areaRect.left;
  const yesY = yesRectV.top - areaRect.top;
  const yesW = yesRectV.width;
  const yesH = yesRectV.height;

  const maxX = areaRect.width - noW - padding;
  const maxY = areaRect.height - noH - padding;

  // Try multiple random placements until we find one that doesn't overlap Yes
  let placed = false;
  for (let i = 0; i < 50; i++) {
    const x = rand(padding, Math.max(padding, maxX));
    const y = rand(padding, Math.max(padding, maxY));

    // Add a small safety gap so they don't touch
    const gap = 8;

    const noBoxX = x - gap;
    const noBoxY = y - gap;
    const noBoxW = noW + gap * 2;
    const noBoxH = noH + gap * 2;

    if (!overlaps(noBoxX, noBoxY, noBoxW, noBoxH, yesX, yesY, yesW, yesH)) {
      noBtn.style.left = `${x}px`;
      noBtn.style.top = `${y}px`;
      placed = true;
      break;
    }
  }

  // Fallback: if area is too small, shove No to the far side away from Yes
  if (!placed) {
    const xLeft = padding;
    const xRight = Math.max(padding, maxX);
    const yMid = Math.min(Math.max(padding, (areaRect.height - noH) / 2), Math.max(padding, maxY));

    // Choose side farther from Yes
    const distLeft = Math.abs(xLeft - yesX);
    const distRight = Math.abs(xRight - yesX);
    noBtn.style.left = `${distRight > distLeft ? xRight : xLeft}px`;
    noBtn.style.top = `${yMid}px`;
  }

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

