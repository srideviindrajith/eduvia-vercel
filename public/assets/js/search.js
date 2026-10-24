/* Search — spotlight-style overlay. Open with the search button, "/" or Ctrl/Cmd+K. */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.getElementById("search"), panel = root.querySelector(".search-panel");
  var input = document.getElementById("searchInput"), list = document.getElementById("searchResults");
  var btn = document.getElementById("searchBtn");
  var isOpen = false, idx = -1, lastFocus = null;

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hl(text, tokens) {
    var out = esc(text);
    tokens.forEach(function (t) {
      if (!t) return;
      out = out.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
    });
    return out;
  }

  function search(q) {
    var tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    return E.COURSES.map(function (c) {
      var cat = E.cat(c.cat), s = 0, ok = true;
      tokens.forEach(function (t) {
        var m = 0;
        if (c.title.toLowerCase().indexOf(t) > -1) m += 4;
        if (cat.name.toLowerCase().indexOf(t) > -1) m += 3;
        if (c.mentor.toLowerCase().indexOf(t) > -1) m += 3;
        if (c.level.toLowerCase().indexOf(t) > -1) m += 2;
        if (c.desc.toLowerCase().indexOf(t) > -1) m += 1;
        if (c.learn.join(" ").toLowerCase().indexOf(t) > -1) m += 1;
        if (!m) ok = false; s += m;
      });
      return ok ? { c: c, s: s } : null;
    }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).slice(0, 8).map(function (x) { return x.c; });
  }

  function itemHTML(c, tokens) {
    var cat = E.cat(c.cat);
    return '<button class="sr-item" type="button" role="option" data-id="' + c.id + '"><img src="' + E.thumbOf(c) + '" alt="" width="88" height="50">' +
      '<span class="sr-t"><b>' + hl(c.title, tokens) + '</b><small>' + cat.name + ' · ' + c.level + ' · ' + c.minutes + ' min · ' + c.mentor + '</small></span>' +
      '<svg class="ico"><use href="#i-arrow"/></svg></button>';
  }

  function render(q) {
    q = q.trim(); idx = -1;
    if (!q) {
      var pop = E.CATEGORIES.map(function (c) { return E.coursesIn(c.slug)[0]; });
      list.innerHTML = '<div class="sr-label">Browse subjects</div><div class="sr-cats">' +
        E.CATEGORIES.map(function (c) {
          return '<a class="sr-cat" href="#/' + c.slug + '" data-route="' + c.slug + '" style="--c1:' + c.c1 + ';--c2:' + c.c2 + '"><svg class="ico"><use href="#' + c.icon + '"/></svg>' + c.name + '</a>';
        }).join("") + '</div><div class="sr-label">Popular lessons</div>' + pop.map(function (c) { return itemHTML(c, []); }).join("");
    } else {
      var res = search(q), tokens = q.toLowerCase().split(/\s+/);
      list.innerHTML = res.length ? '<div class="sr-label">' + res.length + (res.length === 1 ? " lesson" : " lessons") + ' found</div>' + res.map(function (c) { return itemHTML(c, tokens); }).join("")
        : '<div class="sr-empty"><b>Nothing found</b>Try "python", "atom" or "grammar".</div>';
    }
    if (!reduce) gsap.from(list.querySelectorAll(".sr-item,.sr-cat"), { opacity: 0, y: 12, duration: .35, stagger: .03, ease: "power2.out", clearProps: "all" });
  }

  function items() { return Array.prototype.slice.call(list.querySelectorAll(".sr-item")); }
  function setIdx(i) {
    var els = items(); if (!els.length) return;
    idx = (i + els.length) % els.length;
    els.forEach(function (el, k) { el.classList.toggle("is-active", k === idx); });
    els[idx].scrollIntoView({ block: "nearest" });
  }

  function open() {
    if (isOpen || document.body.dataset.stage !== "home") return;
    isOpen = true; lastFocus = document.activeElement;
    root.hidden = false; document.body.style.overflow = "hidden";
    render(""); input.value = "";
    gsap.killTweensOf([panel, root.querySelector(".search-backdrop")]);
    gsap.fromTo(root.querySelector(".search-backdrop"), { opacity: 0 }, { opacity: 1, duration: .3 });
    if (!reduce) gsap.fromTo(panel, { y: -30, scale: .96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .5, ease: "back.out(1.6)" });
    setTimeout(function () { input.focus(); }, 40);
  }
  function close(cb) {
    if (!isOpen) { if (cb) cb(); return; }
    isOpen = false;
    gsap.to(root.querySelector(".search-backdrop"), { opacity: 0, duration: .25 });
    gsap.to(panel, { y: -16, scale: .97, opacity: 0, duration: .25, ease: "power2.in", onComplete: function () {
      root.hidden = true; document.body.style.overflow = ""; gsap.set(panel, { clearProps: "all" });
      if (cb) cb(); else if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    } });
  }

  input.addEventListener("input", function () { render(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(idx + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(idx - 1); }
    else if (e.key === "Enter") { var els = items(); var el = els[idx > -1 ? idx : 0]; if (el) el.click(); }
  });

  list.addEventListener("click", function (e) {
    var it = e.target.closest(".sr-item");
    if (it) {
      var rect = it.getBoundingClientRect(), c = E.course(it.dataset.id);
      close(function () { E.modal.openCourse(c, rect); });
      return;
    }
    if (e.target.closest(".sr-cat")) close(function () {});   /* hash navigation + transition is handled by app.js */
  });
  root.addEventListener("click", function (e) { if (e.target.closest("[data-close-search]")) close(); });

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ""));
    if (e.key === "Escape" && isOpen) { close(); return; }
    if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); open(); }
  });
  btn.addEventListener("click", open);

  E.search = { open: open, close: close };
})();
