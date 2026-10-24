/* Performance helpers: "lite" mode for weaker devices + pause off-screen animations */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});
  var KEY = "eduvia-lite", root = document.documentElement, stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  E.lite = stored === "1" ? true : stored === "0" ? false : (reduce || weak);
  root.classList.toggle("lite", E.lite);

  function setLite(v) {
    E.lite = !!v; root.classList.toggle("lite", E.lite);
    try { localStorage.setItem(KEY, E.lite ? "1" : "0"); } catch (e) {}
    sync();
  }
  var btn;
  function sync() { if (btn) { btn.setAttribute("aria-pressed", E.lite ? "true" : "false"); btn.querySelector("span").textContent = E.lite ? "Effects: Light" : "Effects: Full"; } }

  /* pause infinite animations when their block is not on screen */
  function watchOffscreen() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { en.target.classList.toggle("paused", !en.isIntersecting); });
    }, { rootMargin: "80px" });
    document.querySelectorAll(".orbit,.cat-banner,.cta-band").forEach(function (el) { io.observe(el); });
    new MutationObserver(function () {
      document.querySelectorAll(".orbit,.cat-banner,.cta-band").forEach(function (el) { if (!el.dataset.io) { el.dataset.io = 1; io.observe(el); } });
    }).observe(document.getElementById("view") || document.body, { childList: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    btn = document.getElementById("liteToggle");
    if (btn) { btn.addEventListener("click", function () { setLite(!E.lite); }); sync(); }
    watchOffscreen();
  });
  E.setLite = setLite;
})();
