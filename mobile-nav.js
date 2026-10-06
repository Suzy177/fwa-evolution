/* Phone menu: collapses the nav into a "Menu" button + dropdown panel on narrow screens. */
(function () {
  var bar = document.querySelector("header.sh2-topbar");
  var nav = bar && bar.querySelector(".sh2-nav");
  if (!bar || !nav) return;

  var css = document.createElement("style");
  css.textContent =
    ".mn-btn{display:none;align-items:center;gap:8px;background:var(--surface-2,#1a2236);border:1px solid var(--border,#333);color:var(--text,#fff);font:inherit;font-weight:800;font-size:.86rem;padding:9px 14px;border-radius:999px;cursor:pointer}" +
    ".mn-btn:hover{border-color:#fbbf24}" +
    ".mn-ico{display:inline-block;width:16px;height:12px;position:relative}" +
    ".mn-ico::before,.mn-ico::after,.mn-ico i{content:'';position:absolute;left:0;right:0;height:2px;border-radius:2px;background:currentColor;transition:transform .2s,opacity .2s}" +
    ".mn-ico::before{top:0}.mn-ico i{top:5px}.mn-ico::after{bottom:0}" +
    ".mn-open .mn-ico::before{transform:translateY(5px) rotate(45deg)}" +
    ".mn-open .mn-ico::after{transform:translateY(-5px) rotate(-45deg)}" +
    ".mn-open .mn-ico i{opacity:0}" +
    "@media (max-width:860px){" +
    ".sh2-topbar{flex-direction:row!important;align-items:center!important;justify-content:space-between!important;padding:12px 16px!important}" +
    ".mn-btn{display:inline-flex}" +
    ".sh2-topbar .sh2-nav{display:none!important}" +
    ".sh2-topbar.mn-open .sh2-nav{display:flex!important;flex-direction:column;gap:2px;position:absolute;top:100%;left:0;right:0;padding:10px 16px 16px;background:rgba(10,14,26,.98);border-bottom:1px solid var(--border,#333);box-shadow:0 18px 30px rgba(0,0,0,.45)}" +
    ".sh2-topbar.mn-open .sh2-nav a{padding:13px 14px;font-size:15px;border-radius:12px}" +
    "}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mn-btn";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-label", "Open menu");
  btn.innerHTML = '<span class="mn-ico"><i></i></span>Menu';
  bar.appendChild(btn);

  function set(open) {
    bar.classList.toggle("mn-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  btn.addEventListener("click", function (e) { e.stopPropagation(); set(!bar.classList.contains("mn-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
  document.addEventListener("click", function (e) { if (!bar.contains(e.target)) set(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 860) set(false); });
})();
