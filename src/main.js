import './style.css';
import { mountTitle, initParallax } from './title.js';
import { createBackground } from './background.js';

mountTitle(document.getElementById('title'), 'loop.fun');
initParallax(document.querySelector('.stage'));

const canvas = document.getElementById('bg');
const bg = createBackground(canvas);
if (bg) {
  bg.start();
} else {
  // No WebGL: fall back to the animated CSS gradient (see style.css)
  document.body.classList.add('no-webgl');
  canvas.remove();
}