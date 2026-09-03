// Fullscreen animated color-gradient background rendered by a tiny WebGL
// fragment shader (no dependencies). Falls back to CSS when WebGL is missing.

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer; // -1..1, y up

vec3 palette(float t) {
  vec3 a = vec3(0.32, 0.27, 0.44);
  vec3 b = vec3(0.30, 0.24, 0.33);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.00, 0.22, 0.46);
  return a + b * cos(6.28318530718 * (c * t + d));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.10;
  vec2 p = uv - uPointer * vec2(0.04, 0.04);

  // Smooth layered waves: cheap, seamless "flowing color" field
  float n = 0.0;
  n += sin(p.x * 1.7 + t * 1.2);
  n += sin(p.y * 1.4 - t * 0.9 + 2.1);
  n += sin((p.x + p.y) * 1.0 + t * 0.7 + 4.2);
  n += sin(length(p) * 2.3 - t * 1.5);
  n /= 4.0;

  vec3 col = palette(0.5 + 0.45 * n + t * 0.35);

  // Darken towards the edges so the wordmark keeps contrast
  float vig = smoothstep(1.5, 0.25, length(uv));
  col *= mix(0.45, 1.0, vig);

  // Gentle glow that follows the pointer
  vec2 g = uv - uPointer * vec2(0.3, 0.3);
  col += 0.06 * exp(-3.5 * dot(g, g));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Set up the shader background on `canvas`.
 * Returns a controller `{ start() }` or null if WebGL is unavailable.
 */
export function createBackground(canvas) {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'uRes');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uPointer = gl.getUniformLocation(program, 'uPointer');

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const maxDpr = 2;

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // Pointer position (smoothed), y flipped to match shader space
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  window.addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = -((e.clientY / innerHeight) * 2 - 1);
  });

  let startTime;
  function frame(now) {
    if (startTime === undefined) startTime = now;
    resize();

    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;

    gl.uniform1f(uTime, (now - startTime) / 1000);
    gl.uniform2f(uPointer, px, py);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (!reducedMotion) requestAnimationFrame(frame);
  }

  return {
    start() {
      requestAnimationFrame(frame);
    },
  };
}