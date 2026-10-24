/* Magic dust — lightweight canvas sparkle particles (bursts, trails, pointer glitter) */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});
  var cv = document.getElementById("fx"), ctx = cv.getContext("2d");
  var W = 0, H = 0, dpr = 1, P = [], running = false, last = 0;
  var COLORS = ["#f0d48a", "#c9a24b", "#ffffff", "#b79cf0", "#ffe9a8", "#e6c26a"];
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize); resize();

  function add(p) { if (P.length < 160) { P.push(p); start(); } }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }

  function burst(x, y, n, power) {
    if (reduce || E.lite) return;
    n = n || 24; power = power || 1;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, s = rnd(40, 240) * power;
      add({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, g: 120, life: 0, max: rnd(.7, 1.5),
            size: rnd(2.5, 7), color: pick(COLORS), star: Math.random() < .6, rot: Math.random() * 6.28, vr: rnd(-4, 4), drag: .96 });
    }
  }
  function trail(x, y) {
    if (reduce || E.lite) return;
    for (var i = 0; i < 2; i++) {
      add({ x: x + rnd(-6, 6), y: y + rnd(-6, 6), vx: rnd(-18, 18), vy: rnd(-10, 30), g: 40, life: 0, max: rnd(.5, 1.0),
            size: rnd(1.8, 4.8), color: pick(COLORS), star: Math.random() < .7, rot: Math.random() * 6.28, vr: rnd(-3, 3), drag: .98 });
    }
  }
  /* falling gold dust from top (used when parchment opens) */
  function shower(n) {
    if (reduce || E.lite) return;
    for (var i = 0; i < n; i++) {
      add({ x: rnd(0, W), y: rnd(-40, H * .3), vx: rnd(-20, 20), vy: rnd(30, 120), g: 20, life: 0, max: rnd(1.2, 2.6),
            size: rnd(2, 6), color: pick(COLORS), star: Math.random() < .6, rot: Math.random() * 6.28, vr: rnd(-2, 2), drag: .995 });
    }
  }

  /* slow gold dust drifting upward (intro cover) */
  function rise(n) {
    if (reduce || E.lite) return;
    for (var i = 0; i < n; i++) {
      add({ x: rnd(0, W), y: H + 10, vx: rnd(-14, 14), vy: rnd(-90, -40), g: -6, life: 0, max: rnd(2.2, 3.6),
            size: rnd(1.6, 4.2), color: pick(COLORS), star: Math.random() < .5, rot: Math.random() * 6.28, vr: rnd(-1.5, 1.5), drag: .998 });
    }
  }

  function drawStar(x, y, r, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -r); ctx.lineTo(r * .26, -r * .26); ctx.lineTo(r, 0); ctx.lineTo(r * .26, r * .26);
    ctx.lineTo(0, r); ctx.lineTo(-r * .26, r * .26); ctx.lineTo(-r, 0); ctx.lineTo(-r * .26, -r * .26);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function frame(t) {
    var dt = Math.min((t - last) / 1000, .05); last = t;
    ctx.clearRect(0, 0, W, H);
    for (var i = P.length - 1; i >= 0; i--) {
      var p = P[i]; p.life += dt;
      if (p.life >= p.max) { P.splice(i, 1); continue; }
      p.vx *= Math.pow(p.drag, dt * 60); p.vy = p.vy * Math.pow(p.drag, dt * 60) + p.g * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      var k = p.life / p.max, a = k < .15 ? k / .15 : 1 - (k - .15) / .85, s = p.size * (1 - k * .4);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = a;
      if (p.star) drawStar(p.x, p.y, s * 1.6, p.rot); else { ctx.beginPath(); ctx.arc(p.x, p.y, s * .6, 0, 6.283); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    if (P.length) requestAnimationFrame(frame); else running = false;
  }
  function start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }

  E.fx = { burst: burst, trail: trail, shower: shower, rise: rise, resize: resize };
})();
