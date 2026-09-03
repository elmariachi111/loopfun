// The "loop.fun" wordmark: one floating glyph per letter, staggered bobbing,
// a rainbow hue per glyph, plus a soft pointer parallax on the whole word.

const HUE_START = 320; // pink, wraps around the wheel through the word
const HUE_STEP = 45;

/**
 * Split `text` into individually animated glyphs inside `el`.
 */
export function mountTitle(el, text) {
  el.textContent = '';
  const chars = [...text];
  const mid = (chars.length - 1) / 2;

  chars.forEach((ch, i) => {
    const cell = document.createElement('span');
    cell.className = 'cell';
    cell.setAttribute('aria-hidden', 'true');
    // Parallax depth: outer letters drift a little more than the middle
    cell.style.setProperty('--d', 8 + Math.abs(i - mid) * 3);
    // Rainbow stagger for the gradient fill
    cell.style.setProperty('--hue', HUE_START + i * HUE_STEP);

    const glyph = document.createElement('span');
    glyph.className = 'glyph';
    glyph.textContent = ch;
    // Per-letter bob phase offset
    glyph.style.setProperty('--i', i);

    cell.appendChild(glyph);
    el.appendChild(cell);
  });
}

/**
 * Smoothly track the pointer and expose it as --px / --py on `stage`
 * (CSS does the actual per-letter parallax via the inherited vars).
 */
export function initParallax(stage) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;

  window.addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
  });

  function tick() {
    x += (tx - x) * 0.06;
    y += (ty - y) * 0.06;
    stage.style.setProperty('--px', x.toFixed(4));
    stage.style.setProperty('--py', y.toFixed(4));
    requestAnimationFrame(tick);
  }
  tick();
}