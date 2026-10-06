/* "My profile" shortcut: remembers one player on this device only (localStorage). */
(function () {
  var KEY = "fwa_me";
  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || "null"); return v && v.tag && v.clan ? v : null; } catch (e) { return null; }
  }
  function write(v) {
    try { if (v) localStorage.setItem(KEY, JSON.stringify(v)); else localStorage.removeItem(KEY); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clanSlug() {
    var m = /\/clans\/([a-z0-9-]+)\.html/i.exec(location.pathname);
    return m ? m[1] : null;
  }

  var css = document.createElement("style");
  css.textContent =
    ".profile-me{display:inline-block;margin:20px 0 0 8px;padding:9px 16px;border-radius:999px;border:1px solid var(--border,#333);background:var(--surface-2,#1a2236);color:var(--text,#fff);font-weight:800;font-size:.82rem;cursor:pointer;font-family:inherit}" +
    ".profile-me:hover{border-color:#fbbf24}" +
    ".profile-me.on{border-color:#34d399;color:#34d399}" +
    ".sh2-nav a.me-link{color:#fbbf24}";
  document.head.appendChild(css);

  function syncNav() {
    var nav = document.querySelector(".sh2-nav");
    if (!nav) return;
    var me = read();
    var a = nav.querySelector("a.me-link");
    if (!me) { if (a) a.remove(); return; }
    if (!a) { a = document.createElement("a"); a.className = "me-link"; nav.appendChild(a); }
    a.href = "/clans/" + me.clan + ".html?player=" + encodeURIComponent(me.tag);
    a.textContent = "⭐ Me";
    a.title = "My profile: " + (me.name || me.tag);
  }

  function label(on) { return on ? "✓ This is you · tap to undo" : "⭐ This is me"; }

  window.fwaMe = {
    get: read,
    buttonHtml: function (p) {
      if (!p || !p.tag) return "";
      var me = read();
      var on = !!me && me.tag.toUpperCase() === String(p.tag).toUpperCase();
      return '<button type="button" class="profile-me' + (on ? " on" : "") + '" data-tag="' + esc(p.tag) + '" data-name="' + esc(p.name) + '">' + label(on) + "</button>";
    }
  };

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".profile-me");
    if (!b) return;
    var slug = clanSlug();
    var me = read();
    var isMe = !!me && me.tag.toUpperCase() === b.dataset.tag.toUpperCase();
    if (isMe) write(null);
    else if (slug) write({ tag: b.dataset.tag, name: b.dataset.name, clan: slug });
    var now = read();
    var on = !!now && now.tag.toUpperCase() === b.dataset.tag.toUpperCase();
    b.classList.toggle("on", on);
    b.textContent = label(on);
    syncNav();
  });

  syncNav();
})();
