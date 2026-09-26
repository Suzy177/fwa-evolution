/*
  StatHut shared visitor counter.
  Include with: <script src="/visitor-counter.js" defer></script>
  and put <div class="sh2-visitor-stat" id="sh2VisitorStat"></div> in the page footer.

  Tracks a per-browser id in localStorage so the backend can tell a first-time
  visitor from a returning one, then reports total/new/returning counts back
  into the footer element.
*/
(function () {
  var API_ENDPOINT = "https://api.stathut.in/api/visitors/visit";
  var STORAGE_KEY = "sh_visitor_id";

  function makeId() {
    if (window.crypto && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "sh-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }

  function getVisitorId() {
    try {
      var existing = localStorage.getItem(STORAGE_KEY);
      if (existing) return existing;
      var fresh = makeId();
      localStorage.setItem(STORAGE_KEY, fresh);
      return fresh;
    } catch (e) {
      // localStorage unavailable (private mode, blocked storage, etc.) --
      // the pageview still counts, it just won't be recognized next time.
      return makeId();
    }
  }

  function render(el, data) {
    if (!data || typeof data.total !== "number") {
      el.textContent = "";
      return;
    }
    el.innerHTML =
      "<strong>" + data.total.toLocaleString() + "</strong> total visitors &middot; " +
      data.new.toLocaleString() + " new &middot; " +
      data.returning.toLocaleString() + " returning";
  }

  function init() {
    var el = document.getElementById("sh2VisitorStat");
    if (!el) return;

    fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_id: getVisitorId() }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("API " + r.status);
        return r.json();
      })
      .then(function (data) { render(el, data); })
      .catch(function () { el.textContent = ""; });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
