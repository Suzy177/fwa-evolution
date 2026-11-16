/* FWA Evolution - light animations: floating embers, scroll reveals, count-up.
   No libraries. Respects "reduce motion" and stays off on small phones for particles. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  /* ---------- 1. Floating embers behind the page ---------- */
  function embers() {
    if (window.innerWidth < 700) return;
    var c = document.createElement("canvas");
    c.setAttribute("aria-hidden", "true");
    c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
    document.body.appendChild(c);
    var ctx = c.getContext("2d"), W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), dots = [];
    function size() { W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr; }
    size(); window.addEventListener("resize", size);
    var cols = ["96,165,250", "251,191,36", "167,139,250"];
    function mk(init) {
      return { x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: (Math.random() * 2 + 1.2) * dpr,
        vy: (Math.random() * 0.25 + 0.08) * dpr, vx: (Math.random() - 0.5) * 0.15 * dpr,
        a: Math.random() * 0.5 + 0.4, col: cols[(Math.random() * cols.length) | 0], ph: Math.random() * 6.28 };
    }
    for (var i = 0; i < 46; i++) dots.push(mk(true));
    var t = 0;
    (function frame() {
      t += 0.01; ctx.clearRect(0, 0, W, H);
      dots.forEach(function (d, i) {
        d.y -= d.vy; d.x += d.vx + Math.sin(t + d.ph) * 0.15 * dpr;
        if (d.y < -10) dots[i] = d = mk(false);
        var tw = d.a * (0.6 + 0.4 * Math.sin(t * 2 + d.ph));
        ctx.beginPath(); ctx.fillStyle = "rgba(" + d.col + "," + tw + ")";
        ctx.shadowColor = "rgba(" + d.col + ",.8)"; ctx.shadowBlur = 8 * dpr;
        ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      });
      requestAnimationFrame(frame);
    })();
  }

  /* ---------- 2. Scroll reveals + count-up ---------- */
  function reveals() {
    if (!("IntersectionObserver" in window)) return;
    var css = document.createElement("style");
    css.textContent =
      ".fx-pre{opacity:0;transform:translateY(18px)}" +
      ".fx-in{opacity:1;transform:none;transition:opacity .55s ease,transform .55s cubic-bezier(.2,.7,.2,1);transition-delay:var(--fx-d,0s)}";
    document.head.appendChild(css);
    var targets = document.querySelectorAll(".sh2-section > *, .st-kpi, .st-card");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("fx-in"); io.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    var n = 0;
    targets.forEach(function (el) {
      if (getComputedStyle(el).position === "fixed") return;
      el.style.setProperty("--fx-d", Math.min(n++ % 4, 3) * 0.06 + "s");
      el.classList.add("fx-pre"); io.observe(el);
    });
    /* failsafe: never leave content hidden */
    setTimeout(function () { document.querySelectorAll(".fx-pre:not(.fx-in)").forEach(function (el) {
      var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add("fx-in"); }); }, 2500);
  }

  function countUp() {
    var els = document.querySelectorAll("[data-countup]");
    els.forEach(function (el) {
      var to = parseFloat(el.getAttribute("data-countup")), t0 = null;
      if (isNaN(to)) return;
      (function step(ts) {
        t0 = t0 || ts; var p = Math.min((ts - t0) / 900, 1), v = to * (1 - Math.pow(1 - p, 3));
        el.textContent = Math.round(v).toLocaleString(); if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }
  window.fwaCountUp = countUp;

  function init() { embers(); reveals(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
