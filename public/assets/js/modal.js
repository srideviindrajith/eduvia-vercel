/* Modal — lesson preview (grows out of the clicked card) + Join form */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var modal = document.getElementById("modal"), panel = document.getElementById("modalPanel");
  var backdrop = modal.querySelector(".modal-backdrop");
  var lastFocus = null, closing = false;

  function show(from) {
    lastFocus = document.activeElement; closing = false;
    modal.hidden = false; document.body.style.overflow = "hidden";
    gsap.killTweensOf([panel, backdrop]);
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: .35 });
    if (reduce) { gsap.set(panel, { opacity: 1 }); }
    else if (from) {
      var r = panel.getBoundingClientRect();
      var dx = from.left + from.width / 2 - (r.left + r.width / 2), dy = from.top + from.height / 2 - (r.top + r.height / 2);
      gsap.fromTo(panel, { x: dx, y: dy, scale: Math.min(.5, from.width / r.width), opacity: 0 },
        { x: 0, y: 0, scale: 1, opacity: 1, duration: .6, ease: "power3.out" });
    } else {
      gsap.fromTo(panel, { y: 40, scale: .92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .55, ease: "back.out(1.5)" });
    }
    var cl = panel.querySelector(".modal-close"); if (cl) setTimeout(function () { cl.focus({ preventScroll: true }); }, 60);
  }

  function close() {
    if (closing || modal.hidden) return; closing = true;
    var v = panel.querySelector("video"); if (v) v.pause();
    gsap.to(backdrop, { opacity: 0, duration: .3 });
    gsap.to(panel, { y: 30, scale: .94, opacity: 0, duration: .3, ease: "power2.in", onComplete: function () {
      modal.hidden = true; document.body.style.overflow = ""; panel.innerHTML = ""; panel.classList.remove("narrow");
      gsap.set(panel, { clearProps: "all" });
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    } });
  }

  function closeBtn() {
    return '<button class="icon-btn modal-close" type="button" aria-label="Close" data-close><svg class="ico"><use href="#i-close"/></svg></button>';
  }

  /* placeholder syllabus built from the course's "learn" points — swap for real lesson data later */
  function curriculum(c) {
    var n = c.learn.length, per = Math.max(3, Math.round(c.minutes / n));
    return c.learn.map(function (t, i) {
      var a = Math.max(1, Math.round(per * .3)), b = Math.max(1, Math.round(per * .45)), d = Math.max(1, per - a - b);
      var rows = [["Why “" + t.toLowerCase() + "” matters", a], ["Step-by-step walkthrough", b], ["Try it yourself", d]];
      return '<div class="mod"><button class="mod-h" type="button" aria-expanded="false"><span class="mod-n">' + (i + 1) + '</span>' +
        '<span class="mod-t">' + t + '</span><span class="mod-m">' + per + ' min</span><svg class="ico"><use href="#i-plus"/></svg></button>' +
        '<ul class="mod-b">' + rows.map(function (r, k) {
          return '<li><svg class="ico"><use href="#i-play"/></svg>Lesson ' + (i + 1) + '.' + (k + 1) + ' — ' + r[0] + '<em>' + r[1] + ' min</em></li>';
        }).join("") + '</ul></div>';
    }).join("");
  }
  function toggleMod(mod, force, instant) {
    var body = mod.querySelector(".mod-b"), open = force == null ? !mod.classList.contains("is-open") : force;
    mod.classList.toggle("is-open", open); mod.querySelector(".mod-h").setAttribute("aria-expanded", open);
    if (instant || reduce) { gsap.set(body, { height: open ? "auto" : 0 }); return; }
    gsap.to(body, { height: open ? "auto" : 0, duration: .4, ease: "power2.inOut" });
  }

  function openCourse(c, from) {
    var cat = E.cat(c.cat);
    var enrolled = E.store.has("enrolled", c.id), saved = E.store.has("saved", c.id);
    panel.classList.remove("narrow");
    panel.innerHTML = closeBtn() +
      '<div class="m-player"><video controls playsinline disablepictureinpicture disableremoteplayback controlslist="nodownload noremoteplayback" preload="metadata" poster="' + E.thumbOf(c) + '" src="' + (c.video || E.DEMO_VIDEO) + '"></video>' +
      '<span class="m-note">Preview — replace with the lesson video</span></div>' +
      '<div class="m-body"><div class="m-tags">' +
        '<span><svg class="ico"><use href="#' + cat.icon + '"/></svg>' + cat.name + '</span>' +
        '<span><svg class="ico"><use href="#i-bulb"/></svg>' + c.level + '</span>' +
        '<span><svg class="ico"><use href="#i-clock"/></svg>' + c.minutes + ' min</span>' +
        '<span><svg class="ico"><use href="#i-layers"/></svg>' + c.lessons + ' lessons</span></div>' +
      '<h2 id="modalTitle">' + c.title + '</h2><p>' + c.desc + ' Taught by <strong>' + c.mentor + '</strong>.</p>' +
      '<ul class="m-learn">' + c.learn.map(function (l) { return '<li><svg class="ico"><use href="#i-check"/></svg>' + l + '</li>'; }).join("") + '</ul>' +
      '<h3 class="m-sub">Course content</h3><div class="curric">' + curriculum(c) + '</div>' +
      '<div class="m-actions">' +
        '<button class="btn btn-primary" id="enrolBtn" type="button"><svg class="ico tick"><use href="#i-check"/></svg><span>' + (enrolled ? "Enrolled" : "Enrol free") + '</span><svg class="ico"><use href="#i-arrow"/></svg></button>' +
        '<button class="btn btn-ghost" id="saveBtn" type="button"><svg class="ico tick"><use href="#i-check"/></svg><svg class="ico"><use href="#i-bookmark"/></svg><span>' + (saved ? "Saved" : "Save for later") + '</span></button>' +
      '</div></div>';

    var enrol = panel.querySelector("#enrolBtn"), save = panel.querySelector("#saveBtn");
    panel.querySelectorAll(".mod-h").forEach(function (h, i) {
      h.addEventListener("click", function () { toggleMod(h.parentNode, null, false); });
      if (i === 0) toggleMod(h.parentNode, true, true);
    });
    enrol.classList.toggle("is-on", enrolled); save.classList.toggle("is-on", saved);
    enrol.addEventListener("click", function () {
      var on = E.store.toggle("enrolled", c.id);
      enrol.classList.toggle("is-on", on); enrol.querySelector("span").textContent = on ? "Enrolled" : "Enrol free";
      document.querySelectorAll('.vcard[data-id="' + c.id + '"]').forEach(function (el) { el.classList.toggle("is-enrolled", on); });
      if (on) { var r = enrol.getBoundingClientRect(); E.fx.burst(r.left + r.width / 2, r.top + r.height / 2, 34, 1.2); }
    });
    save.addEventListener("click", function () {
      var on = E.store.toggle("saved", c.id);
      save.classList.toggle("is-on", on); save.querySelector("span").textContent = on ? "Saved" : "Save for later";
      if (on) { var r = save.getBoundingClientRect(); E.fx.burst(r.left + 30, r.top + r.height / 2, 14, .7); }
    });
    show(from);
  }

  function openJoin() {
    panel.classList.add("narrow");
    panel.innerHTML = closeBtn() +
      '<div class="join" id="joinBox"><svg class="j-mark"><use href="#compass"/></svg>' +
      '<div class="j-intro"><h2 id="modalTitle">Begin your story</h2><p>Join Eduvia free and get new lessons in your inbox every week.</p></div>' +
      '<form id="joinForm" novalidate><input class="field" type="text" name="name" placeholder="Your name" autocomplete="name" required>' +
      '<input class="field" type="email" name="email" placeholder="Email address" autocomplete="email" required>' +
      '<button class="btn btn-gold btn-lg" type="submit"><span>Open the book</span><svg class="ico"><use href="#i-arrow"/></svg></button></form>' +
      '<div class="done"><div class="big-tick"><svg class="ico"><use href="#i-check"/></svg></div><h2>Welcome aboard!</h2><p>Your learning journey begins now.</p></div></div>';
    var form = panel.querySelector("#joinForm"), box = panel.querySelector("#joinBox");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = form.elements.email;
      if (!/^\S+@\S+\.\S+$/.test(em.value)) { em.focus(); gsap.fromTo(em, { x: -8 }, { x: 0, duration: .5, ease: "elastic.out(1,.3)" }); return; }
      box.classList.add("is-done");
      var r = box.getBoundingClientRect(); E.fx.burst(r.left + r.width / 2, r.top + 140, 50, 1.4);
      setTimeout(close, 2200);
    });
    show(null);
    var first = form.elements.name; if (first) setTimeout(function () { first.focus(); }, 80);
  }

  modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  E.modal = { openCourse: openCourse, openJoin: openJoin, close: close };
})();
