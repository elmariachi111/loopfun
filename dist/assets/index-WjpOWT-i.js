(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function c(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(t){if(t.ep)return;t.ep=!0;const o=c(t);fetch(t.href,o)}})();const S=320,T=45;function b(r,e){r.textContent="";const c=[...e],n=(c.length-1)/2;c.forEach((t,o)=>{const i=document.createElement("span");i.className="cell",i.setAttribute("aria-hidden","true"),i.style.setProperty("--d",8+Math.abs(o-n)*3),i.style.setProperty("--hue",S+o*T);const s=document.createElement("span");s.className="glyph",s.textContent=t,s.style.setProperty("--i",o),i.appendChild(s),r.appendChild(i)})}function L(r){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;let c=0,n=0,t=0,o=0;window.addEventListener("pointermove",s=>{c=s.clientX/innerWidth*2-1,n=s.clientY/innerHeight*2-1});function i(){t+=(c-t)*.06,o+=(n-o)*.06,r.style.setProperty("--px",t.toFixed(4)),r.style.setProperty("--py",o.toFixed(4)),requestAnimationFrame(i)}i()}const F=`
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,M=`
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
`;function v(r,e,c){const n=r.createShader(e);return r.shaderSource(n,c),r.compileShader(n),r.getShaderParameter(n,r.COMPILE_STATUS)?n:(console.error(r.getShaderInfoLog(n)),r.deleteShader(n),null)}function _(r){const e=r.getContext("webgl",{antialias:!1,alpha:!1,powerPreference:"low-power"});if(!e)return null;const c=v(e,e.VERTEX_SHADER,F),n=v(e,e.FRAGMENT_SHADER,M);if(!c||!n)return null;const t=e.createProgram();if(e.attachShader(t,c),e.attachShader(t,n),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))return console.error(e.getProgramInfoLog(t)),null;e.useProgram(t);const o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const i=e.getAttribLocation(t,"aPos");e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0);const s=e.getUniformLocation(t,"uRes"),w=e.getUniformLocation(t,"uTime"),x=e.getUniformLocation(t,"uPointer"),E=matchMedia("(prefers-reduced-motion: reduce)").matches,R=2;function l(){const a=Math.min(devicePixelRatio||1,R),m=Math.max(1,Math.floor(r.clientWidth*a)),h=Math.max(1,Math.floor(r.clientHeight*a));(r.width!==m||r.height!==h)&&(r.width=m,r.height=h,e.viewport(0,0,m,h)),e.uniform2f(s,r.width,r.height)}window.addEventListener("resize",l),l();let u=0,d=0,p=0,g=0;window.addEventListener("pointermove",a=>{p=a.clientX/innerWidth*2-1,g=-(a.clientY/innerHeight*2-1)});let f;function y(a){f===void 0&&(f=a),l(),u+=(p-u)*.05,d+=(g-d)*.05,e.uniform1f(w,(a-f)/1e3),e.uniform2f(x,u,d),e.drawArrays(e.TRIANGLE_STRIP,0,4),E||requestAnimationFrame(y)}return{start(){requestAnimationFrame(y)}}}b(document.getElementById("title"),"loop.fun");L(document.querySelector(".stage"));const A=document.getElementById("bg"),P=_(A);P?P.start():(document.body.classList.add("no-webgl"),A.remove());
