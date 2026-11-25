// Landing page: an eccentric inspiral in general relativity, orbiting the photo.
//
// Geometric units G = c = M = 1. The orbit is tracked by osculating elements
// (a, e, periastron angle w, mean anomaly l):
//   periastron advance (1PN): dw/dt = 3 n / (a (1 - e^2))
//   radiation reaction (Peters 1964), sped up by BOOST so a run lasts ~15 s.
// On screen, the radius is mapped to R0 + s * r so the orbit always clears the photo.
(function () {
  var canvas = document.getElementById("orbit-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var photo = document.querySelector(".portrait");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  var css = getComputedStyle(document.documentElement);
  var INK = css.getPropertyValue("--ink").trim() || "#0E3B43";
  var ACCENT = css.getPropertyValue("--accent").trim() || "#F0603F";

  var A0 = 30, A_END = 6, ETA = 0.14, SPEED = 850, E0 = 0.55;
  var TRAIL_SECONDS = 7;

  var W = 0, H = 0, cx = 0, cy = 0, R0 = 0, s = 1;
  var st, trail = [], clock = 0, last = null, burst = null, nsPos = null, boost = 1;

  function rgba(hex, a) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h, 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2; cy = H / 2;
    var pr = photo ? photo.getBoundingClientRect().width / 2 : 120;
    R0 = pr + 22;
    var room = Math.min(W, H) / 2 - 14;
    s = Math.max(0.5, (room - R0) / (A0 * (1 + E0)));
  }

  function reset() {
    boost = 14 * Math.pow(1 - E0 * E0, 3);
    st = { a: A0, e: E0, w: Math.random() * 6.283, l: Math.PI };
    trail = []; burst = null; nsPos = null;
  }

  function step(dt) {
    var a = st.a, e = st.e, n = Math.pow(a, -1.5), q = 1 - e * e;
    var dadt = -boost * (64 / 5) * ETA / (a * a * a) * (1 + 73 / 24 * e * e + 37 / 96 * e * e * e * e) / Math.pow(q, 3.5);
    var dedt = -boost * (304 / 15) * ETA * e / (a * a * a * a) * (1 + 121 / 304 * e * e) / Math.pow(q, 2.5);
    st.l += n * dt;
    st.w += 3 * n / (a * q) * dt;
    st.a = a + dadt * dt;
    st.e = Math.max(0, e + dedt * dt);
  }

  function position() {
    var a = st.a, e = st.e, E = st.l;
    for (var i = 0; i < 10; i++) E -= (E - e * Math.sin(E) - st.l) / (1 - e * Math.cos(E));
    var x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E);
    var r = Math.sqrt(x * x + y * y), ang = Math.atan2(y, x) + st.w;
    var rp = R0 + s * r;
    return [cx + rp * Math.cos(ang), cy - rp * Math.sin(ang)];
  }

  function advance(real) {
    var simDt = real * SPEED * (st.a / A0), sub = 40;
    for (var i = 0; i < sub && st.a > A_END; i++) {
      step(simDt / sub);
      if (i % 4 === 0) { var q = position(); trail.push([q[0], q[1], clock]); }
    }
    nsPos = position();
    trail.push([nsPos[0], nsPos[1], clock]);
  }

  function drawTrail(fade) {
    while (fade && trail.length && clock - trail[0][2] > TRAIL_SECONDS) trail.shift();
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 2;
    var CHUNK = 24;
    for (var i = 0; i < trail.length - 1; i += CHUNK) {
      var seg = trail.slice(i, i + CHUNK + 1);
      var age = fade ? (clock - seg[seg.length - 1][2]) / TRAIL_SECONDS : 0;
      ctx.strokeStyle = rgba(INK, fade ? (0.55 * Math.pow(1 - age, 1.4)).toFixed(3) : 0.35);
      ctx.beginPath(); ctx.moveTo(seg[0][0], seg[0][1]);
      for (var k = 1; k < seg.length; k++) ctx.lineTo(seg[k][0], seg[k][1]);
      ctx.stroke();
    }
  }

  function drawStar(p) {
    ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, 2 * Math.PI);
    ctx.fillStyle = ACCENT; ctx.fill();
  }

  function frame(t) {
    var real = last === null ? 0 : Math.min((t - last) / 1000, 0.05);
    last = t; clock += real;
    ctx.clearRect(0, 0, W, H);
    if (burst === null) {
      advance(real);
      drawTrail(true);
      drawStar(nsPos);
      if (st.a <= A_END) burst = 0;
    } else {
      // Merger: gravitational-wave ripples spread out from the centre, then start again.
      burst += real;
      drawTrail(true);
      for (var k = 0; k < 3; k++) {
        var r = R0 - 10 + (burst - k * 0.3) * 190;
        if (r > R0 - 10) {
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
          ctx.strokeStyle = rgba(ACCENT, Math.max(0, 0.8 - (r - R0) / 320).toFixed(3));
          ctx.lineWidth = 2.5; ctx.stroke();
        }
      }
      if (burst > 2.4) reset();
    }
    requestAnimationFrame(frame);
  }

  function drawStatic() {
    reset();
    var guard = 0;
    while (st.a > A_END && guard++ < 200000) advance(0.01);
    ctx.clearRect(0, 0, W, H);
    drawTrail(false);
  }

  window.addEventListener("resize", function () {
    resize();
    if (reduce.matches) drawStatic(); else trail = [];
  });

  resize();
  if (reduce.matches) { drawStatic(); return; }
  reset();
  requestAnimationFrame(frame);
})();
