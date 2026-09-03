# loop.fun

A playful single-page wordmark for the loop.fun domain — balloon-style letters
bobbing over an animated WebGL color gradient. No product, no pitch, just
loop.fun spanning the screen.

Built with plain HTML/CSS/JS bundled by [Vite](https://vite.dev). No framework.

## Dev

```sh
npm install
npm run dev      # local dev server
npm run build    # static site into dist/
npm run preview  # serve the build locally
```

## Structure

```
index.html          # page shell, loads the Rubik Bubbles font
src/main.js        # entry: wires background + wordmark
src/background.js  # fullscreen WebGL shader (flowing color gradient, pointer glow)
src/title.js       # letter splitting, rainbow hues, pointer parallax
src/style.css      # layout, bobbing animation, no-WebGL fallback
```

## Deploy

`npm run build` produces a fully static `dist/` — host it anywhere (Vercel,
Netlify, GitHub Pages, S3, …) and point the loop.fun DNS at it.