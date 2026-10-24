/* Eduvia — app bootstrap: loader → intro → home (header → hero → cards), routing, buttons, filters */
(function () {
  var E = window.Eduvia;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches;
  var body = document.body, view = document.getElementById("view"), header = document.getElementById("siteHeader");
  var state = { route: "home" }, pending = null, pointer = { x: innerWidth / 2, y: 70 };

  function setStage(s) { body.dataset.stage = s; }
  function parse() { var h = location.hash.replace(/^#\/?/, ""); return E.cat(h) ? h : "home"; }

  /* ---------- render a view ---------- */
  function render(route) {
    E.cards.reset();
    view.innerHTML = route === "home" ? E.views.home() : E.views.category(route);
    E.cards.bind(view);
    E.cards.reveal(view);
    bindFilters();
    E.nav.setActive(route);
    var c = E.cat(route);
    document.title = (c ? c.name + " — " : "") + "Eduvia — The Art of Learning";
    state.route = route;
  }

  function countUp(root) {
    root.querySelectorAll("[data-count]").forEach(function (el) {
      var end = +el.dataset.count, o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.6, delay: .4, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }

  /* ---------- starting the home page: header first, THEN hero + video cards ---------- */
  function startHome() {
    return E.nav.appear().then(function () {
      E.cards.enable();
      countUp(view);
    });
  }

  /* ---------- route changes with transition ---------- */
  function navigate(route) {
    if (E.transition.isBusy()) { pending = route; return; }
    var c = E.cat(route);
    E.cards.disable();
    E.transition.go({
      x: pointer.x, y: pointer.y,
      title: c ? c.name : "Home", sub: c ? c.tagline : "Back to where it all begins",
      kicker: c ? "Entering" : "Returning", icon: c ? c.icon : "i-home",
      swap: function () { render(route); }
    }).then(function () {
      E.cards.enable();
      if (route === "home") countUp(view);
    });
    /* resolve happens mid-wipe; handle a queued click once finished */
    var wait = setInterval(function () {
      if (!E.transition.isBusy()) {
        clearInterval(wait);
        if (pending && pending !== state.route) { var p = pending; pending = null; navigate(p); } else pending = null;
      }
    }, 120);
  }

  window.addEventListener("hashchange", function () {
    var r = parse();
    if (r !== state.route) navigate(r);
  });

  /* ---------- global click handling ---------- */
  document.addEventListener("pointerdown", function (e) { pointer = { x: e.clientX, y: e.clientY }; }, true);

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-route]");
    if (a) {
      if (a.dataset.route === state.route) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
      return;
    }
    var fq = e.target.closest(".faq-q");
    if (fq) {
      var box = fq.parentNode, ans = box.querySelector(".faq-a"), open = !box.classList.contains("is-open");
      box.classList.toggle("is-open", open); fq.setAttribute("aria-expanded", open);
      gsap.to(ans, { height: open ? "auto" : 0, duration: reduce ? 0 : .4, ease: "power2.inOut" });
      if (open) { var r = fq.getBoundingClientRect(); E.fx.burst(r.right - 40, r.top + r.height / 2, 8, .5); }
      return;
    }
    var sc = e.target.closest("[data-scroll]");
    if (sc) {
      var t = document.querySelector(sc.dataset.scroll);
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 90, behavior: "smooth" });
      return;
    }
    var act = e.target.closest("[data-action]");
    if (act) {
      if (act.dataset.action === "join") E.modal.openJoin();
      if (act.dataset.action === "replay") replay();
    }
  });
  document.getElementById("joinBtn").addEventListener("click", function () { E.modal.openJoin(); });
  document.getElementById("replayIntro").addEventListener("click", replay);
  function replay() { window.scrollTo(0, 0); location.reload(); }

  /* ---------- level filter on category pages ---------- */
  function bindFilters() {
    var wrap = view.querySelector(".filters"); if (!wrap) return;
    var grid = view.querySelector("#catGrid"), slug = wrap.dataset.slug;
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest(".chipbtn"); if (!b || b.classList.contains("is-on")) return;
      wrap.querySelectorAll(".chipbtn").forEach(function (x) { x.classList.toggle("is-on", x === b); });
      var lvl = b.dataset.level;
      var list = E.coursesIn(slug).filter(function (c) { return lvl === "all" || c.level === lvl; });
      var r = b.getBoundingClientRect(); E.fx.burst(r.left + r.width / 2, r.top + r.height / 2, 10, .6);
      function swap() {
        grid.innerHTML = list.length ? list.map(E.cards.html).join("") : '<p class="empty">No courses at this level yet — more are on the way.</p>';
        E.cards.bind(grid);
        var cs = Array.prototype.slice.call(grid.querySelectorAll(".vcard"));
        gsap.set(cs, { opacity: 0, y: 50, rotationX: reduce ? 0 : -12, scale: .94, transformPerspective: 900 });
        E.cards.animate(cs);
      }
      if (reduce) swap();
      else gsap.to(grid.children, { opacity: 0, y: 20, scale: .95, duration: .25, stagger: .03, ease: "power2.in", onComplete: swap });
    });
  }

  /* ---------- buttons: ripple + magnetic pull ---------- */
  document.addEventListener("pointerdown", function (e) {
    var btn = e.target.closest(".btn"); if (!btn) return;
    var r = btn.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2;
    var s = document.createElement("span"); s.className = "ripple";
    s.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + (e.clientX - r.left - size / 2) + "px;top:" + (e.clientY - r.top - size / 2) + "px";
    btn.appendChild(s); setTimeout(function () { s.remove(); }, 750);
  });
  if (fine && !reduce) {
    var lastBtn = null;
    document.addEventListener("pointermove", function (e) {
      var btn = e.target.closest && e.target.closest(".btn");
      if (lastBtn && lastBtn !== btn) { lastBtn.style.setProperty("--bx", "0px"); lastBtn.style.setProperty("--by", "0px"); }
      lastBtn = btn;
      if (btn) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty("--bx", ((e.clientX - r.left) / r.width - .5) * 10 + "px");
        btn.style.setProperty("--by", ((e.clientY - r.top) / r.height - .5) * 8 + "px");
      }
    });
    /* faint glitter that follows the cursor */
    var lastT = 0;
    document.addEventListener("pointermove", function (e) {
      var now = performance.now();
      if (!E.lite && now - lastT > 140 && body.dataset.stage === "home" && !(e.target.closest && e.target.closest("#modal"))) { lastT = now; E.fx.trail(e.clientX, e.clientY); }
    });
  }

  /* ---------- header shadow on scroll ---------- */
  var bar = document.querySelector("#progress i"), toTop = document.getElementById("toTop");
  function onScroll() {
    header.classList.toggle("is-scrolled", scrollY > 20);
    var max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, scrollY / max) : 0) + ")";
    if (toTop) toTop.classList.toggle("show", scrollY > 700);
  }
  toTop.addEventListener("click", function () {
    var r = toTop.getBoundingClientRect(); E.fx.burst(r.left + r.width / 2, r.top + r.height / 2, 20, .9);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- boot ---------- */
  function boot() {
    document.getElementById("year").textContent = new Date().getFullYear();
    E.nav.buildNav();
    render(parse());

    E.loader.run().then(function (videoOk) {
      var skipIntro = reduce || !videoOk || /[?&]nointro/.test(location.search);
      return E.loader.exit(function () {
        if (skipIntro) { setStage("home"); setTimeout(startHome, 500); }
        else {
          setStage("intro");
          E.intro.play(function () { setStage("home"); }).then(startHome);
        }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
