/* Live war strip: shows ongoing family wars right under the site header. Hidden when no war is live. */
(function () {
  var API = "https://api.stathut.in/api/clan/";
  var CLANS = [
    { slug: "the-shield", name: "The Shield" },
    { slug: "invidia-bandit", name: "Invidia Bandit" },
    { slug: "village-warriors", name: "Village Warriors" }
  ];
  var header = document.querySelector("header.sh2-topbar") || document.querySelector("header");
  if (!header) return;

  var css = document.createElement("style");
  css.textContent =
    ".wt-strip{background:linear-gradient(90deg,rgba(52,211,153,.12),rgba(59,130,246,.10));border-bottom:1px solid var(--border,#222);}" +
    ".wt-in{max-width:1100px;margin:0 auto;padding:8px 24px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:12.5px;color:var(--text-dim,#9aa4b8);}" +
    ".wt-live{display:inline-flex;align-items:center;gap:6px;font-weight:800;letter-spacing:.08em;font-size:11px;color:#34d399;text-transform:uppercase;}" +
    ".wt-dot{width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 0 0 rgba(52,211,153,.6);animation:wtp 1.8s infinite;}" +
    "@keyframes wtp{70%{box-shadow:0 0 0 7px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}" +
    ".wt-item{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:var(--surface-2,#1a2236);border:1px solid var(--border,#222);color:var(--text,#fff);text-decoration:none;white-space:nowrap;}" +
    ".wt-item:hover{border-color:#34d399;}" +
    ".wt-sc{font-weight:800;font-variant-numeric:tabular-nums;}" +
    ".wt-t{color:var(--text-dim,#9aa4b8);}" +
    ".wt-more{margin-left:auto;color:var(--text-dim,#9aa4b8);text-decoration:none;font-weight:600;}" +
    ".wt-more:hover{color:var(--text,#fff);}" +
    "@media(max-width:560px){.wt-in{padding:8px 16px;gap:8px}.wt-more{display:none}.wt-item{font-size:12px}}";
  document.head.appendChild(css);

  var strip = document.createElement("div");
  strip.className = "wt-strip";
  strip.style.display = "none";
  strip.innerHTML = '<div class="wt-in"></div>';
  header.insertAdjacentElement("afterend", strip);
  var box = strip.firstChild;

  function parseCoc(s) {
    var m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/.exec(s || "");
    return m ? Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +m[6]) : null;
  }
  function left(ms) {
    if (ms == null) return "";
    var d = ms - Date.now();
    if (d <= 0) return "ending";
    var h = Math.floor(d / 36e5), m = Math.floor((d % 36e5) / 6e4);
    return (h ? h + "h " : "") + m + "m";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var wars = [];
  function render() {
    if (!wars.length) { strip.style.display = "none"; return; }
    var html = '<span class="wt-live"><span class="wt-dot"></span>Live wars</span>';
    wars.forEach(function (w) {
      var c = w.data.clan || {}, o = w.data.opponent || {};
      var isWar = w.data.state === "inWar";
      var mid = isWar
        ? '<span class="wt-sc">' + (c.stars || 0) + "★ – " + (o.stars || 0) + "★</span>"
        : '<span class="wt-t">prep day</span>';
      var t = left(parseCoc(w.data.endTime));
      html += '<a class="wt-item" href="/fwa-war-status.html">' + esc(w.name) + " " + mid +
        ' <span class="wt-t">vs ' + esc(o.name || "?") + (t ? " · " + t : "") + "</span></a>";
    });
    html += '<a class="wt-more" href="/fwa-war-status.html">War status →</a>';
    box.innerHTML = html;
    strip.style.display = "";
  }

  function load() {
    Promise.all(CLANS.map(function (c) {
      var ctl = new AbortController();
      var to = setTimeout(function () { ctl.abort(); }, 8000);
      return fetch(API + c.slug + "/currentwar", { signal: ctl.signal })
        .then(function (r) { clearTimeout(to); return r.ok ? r.json() : null; })
        .then(function (d) { return d && (d.state === "inWar" || d.state === "preparation") ? { name: c.name, data: d } : null; })
        .catch(function () { return null; });
    })).then(function (list) {
      wars = list.filter(Boolean);
      render();
    });
  }

  load();
  setInterval(load, 60000);
  setInterval(render, 30000);
})();
