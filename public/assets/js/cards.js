/* Video cards — markup, hover tilt + glare, click ripple, scroll-reveal with magic-dust, enrol/save state */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* ---------- saved / enrolled state (localStorage, optional) ---------- */
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem("eduvia:" + k)) || []; } catch (e) { return []; } },
    set: function (k, v) { try { localStorage.setItem("eduvia:" + k, JSON.stringify(v)); } catch (e) {} },
    has: function (k, id) { return store.get(k).indexOf(id) > -1; },
    toggle: function (k, id) {
      var a = store.get(k), i = a.indexOf(id);
      if (i > -1) a.splice(i, 1); else a.push(id);
      store.set(k, a); return i === -1;
    }
  };
  E.store = store;

  function initials(name) { return name.replace(/^(Dr\.|Coach)\s+/i, "").split(" ").map(function (w) { return w[0]; }).slice(0, 2).join(""); }

  function cardHTML(c) {
    var cat = E.cat(c.cat);
    return '<article class="vcard rv" tabindex="0" role="button" aria-label="Watch ' + c.title + '" data-id="' + c.id + '"' +
      ' style="--c1:' + cat.c1 + ';--c2:' + cat.c2 + '"' + (store.has("enrolled", c.id) ? ' data-enrolled="1"' : '') + '>' +
      '<div class="v-thumb"><img src="' + E.thumbOf(c) + '" alt="" loading="lazy" width="640" height="360">' +
      '<span class="v-badge"><svg class="ico"><use href="#' + cat.icon + '"/></svg>' + cat.name + '</span>' +
      '<span class="v-state"><svg class="ico"><use href="#i-check"/></svg>Enrolled</span>' +
      '<span class="v-play"><svg class="ico"><use href="#i-play"/></svg></span>' +
      '<span class="v-dur"><svg class="ico"><use href="#i-clock"/></svg>' + c.minutes + ' min</span></div>' +
      '<div class="v-body"><h3>' + c.title + '</h3><p>' + c.desc + '</p>' +
      '<div class="v-meta"><span><svg class="ico"><use href="#i-layers"/></svg>' + c.lessons + ' lessons</span>' +
      '<span><svg class="ico"><use href="#i-bulb"/></svg>' + c.level + '</span></div>' +
      '<div class="v-foot"><span class="v-mentor"><span class="v-avatar">' + initials(c.mentor) + '</span>' + c.mentor + '</span>' +
      '<span class="v-go">Watch<svg class="ico"><use href="#i-arrow"/></svg></span></div></div></article>';
  }

  /* ---------- interactions ---------- */
  function bind(root) {
    root.querySelectorAll(".vcard").forEach(function (card) {
      if (card.dataset.bound) return; card.dataset.bound = "1";
      if (card.dataset.enrolled) card.classList.add("is-enrolled");

      function open() { E.modal.openCourse(E.course(card.dataset.id), card.getBoundingClientRect()); }
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });

      if (fine && !reduce) {
        var qx, qy;
        card.addEventListener("pointermove", function (e) {
          if (card.dataset.anim || E.lite) return;
          if (!qx) {
            qx = gsap.quickTo(card, "rotationY", { duration: .5, ease: "power3.out" });
            qy = gsap.quickTo(card, "rotationX", { duration: .5, ease: "power3.out" });
            gsap.set(card, { transformPerspective: 900 });
          }
          var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          qx((px - .5) * 10); qy((.5 - py) * 8);
          card.style.setProperty("--mx", px * 100 + "%"); card.style.setProperty("--my", py * 100 + "%");
        });
        card.addEventListener("pointerleave", function () { if (qx) { qx(0); qy(0); } });
      }
    });
  }

  /* ---------- scroll reveal (.rv elements): waits until the header has appeared ---------- */
  var enabled = false, queue = [], io = null;
  function animate(els) {
    if (!els.length) return;
    els.forEach(function (el) { el.dataset.anim = "1"; });
    if (reduce) { gsap.set(els, { opacity: 1 }); els.forEach(function (el) { delete el.dataset.anim; }); return; }
    gsap.to(els, {
      opacity: 1, y: 0, rotationX: 0, scale: 1, duration: .9, ease: "back.out(1.35)", stagger: .1,
      onStart: function () { /* sparkle where each card lands */
        els.forEach(function (el, i) {
          setTimeout(function () { var r = el.getBoundingClientRect(); E.fx.burst(r.left + r.width / 2, r.top + 20, 6, .5); }, i * 100 + 120);
        });
      },
      onComplete: function () { els.forEach(function (el) { delete el.dataset.anim; gsap.set(el, { clearProps: "filter" }); }); }
    });
  }
  function flush() { var q = queue; queue = []; animate(q); }

  function reveal(root) {
    var els = Array.prototype.slice.call(root.querySelectorAll(".rv"));
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { queue.push(en.target); io.unobserve(en.target); }
        });
        if (enabled) { clearTimeout(reveal._t); reveal._t = setTimeout(flush, 30); }
      }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    }
    gsap.set(els, { opacity: 0, y: 60, rotationX: reduce ? 0 : -14, scale: .94, transformPerspective: 900 });
    els.forEach(function (el) { io.observe(el); });
  }

  E.cards = {
    html: cardHTML, bind: bind, reveal: reveal, animate: animate,
    enable: function () { enabled = true; flush(); },
    disable: function () { enabled = false; },
    reset: function () { queue = []; if (io) io.disconnect(); }
  };
})();
