/* Intro — an interactive book scene (not a plain video clip).
   The video runs 0→PAUSE_AT, then freezes on the EDUVIA cover while HTML UI + parallax + glow + dust keep the scene alive.
   The visitor touches / clicks / presses a key to open the book (or it opens by itself after AUTO_MS).
   Then the video resumes, and near the end we "shoot" into the blank page → parchment → home. */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});
  var intro = document.getElementById("intro"), video = document.getElementById("introVideo");
  var stage = document.getElementById("inStage"), glow = document.getElementById("inGlow");
  var ui = document.getElementById("inUi"), ring = intro.querySelector(".in-ring-prog"), openBtn = document.getElementById("openBook");
  var skip = document.getElementById("skipIntro");
  var light = intro.querySelector(".in-light"), paper = intro.querySelector(".in-paper");
  var PAUSE_AT = 1.5, AUTO_MS = 4500;
  var tl = null, ringTween = null, dustTimer = 0, raf = 0, active = false;
  var st;

  function resetState() { st = { phase: "idle", opened: false, shooting: false, mx: .5, my: .5, cx: .5, cy: .5, t0: 0 }; }
  resetState();

  function play(onCovered) {
    return new Promise(function (resolve) {
      resetState(); active = true;
      var lite = !!E.lite, BASE = innerWidth / innerHeight < .8 ? 1.4 : 1.07;
      video.muted = true; video.currentTime = 0; video.playbackRate = 1;
      gsap.set(stage, { scale: BASE, x: 0, y: 0 });
      gsap.set([ui, glow], { autoAlpha: 0 });
      gsap.set(skip, { autoAlpha: 0 });
      gsap.to(skip, { autoAlpha: 1, duration: .6, delay: 1 });
      skip.classList.add("show");
      st.t0 = performance.now();

      /* ---- living camera: cursor parallax + slow drift + glow ---- */
      function onMove(e) { st.mx = e.clientX / innerWidth; st.my = e.clientY / innerHeight; }
      function tick(now) {
        if (!active || st.shooting) return;
        st.cx += (st.mx - st.cx) * .06; st.cy += (st.my - st.cy) * .06;
        var t = (now - st.t0) / 1000;
        var dx = (st.cx - .5) * -34 + (lite ? 0 : Math.sin(t * .5) * 7);
        var dy = (st.cy - .5) * -22 + (lite ? 0 : Math.cos(t * .4) * 5);
        gsap.set(stage, { x: dx, y: dy, scale: BASE + (lite ? 0 : Math.sin(t * .3) * .008) });
        gsap.set(glow, { x: st.cx * innerWidth, y: st.cy * innerHeight });
        /* pause on the cover */
        if (st.phase === "idle" && video.currentTime >= PAUSE_AT) {
          if (st.opened) { st.phase = "opening"; }
          else { video.pause(); showPrompt(); }
        }
        /* trigger the shoot shortly before the video ends */
        if (st.phase === "opening" && video.duration && video.currentTime >= video.duration - 1.5) shoot(false);
        raf = requestAnimationFrame(tick);
      }
      document.addEventListener("pointermove", onMove);

      function showPrompt() {
        if (st.phase !== "idle") return;
        st.phase = "prompt";
        gsap.to(ui, { autoAlpha: 1, y: 0, duration: .8, ease: "power2.out" });
        gsap.fromTo(ui, { y: 18 }, { y: 0, duration: .8, ease: "power2.out" });
        gsap.to(glow, { autoAlpha: 1, duration: 1.2 });
        E.fx.burst(innerWidth / 2, innerHeight * .5, 16, .6);
        if (!lite) dustTimer = setInterval(function () { if (E.fx.rise) E.fx.rise(3); }, 420);
        ringTween = gsap.to(ring, { strokeDashoffset: 0, duration: AUTO_MS / 1000, ease: "none", onComplete: openBook });
      }

      /* ---- user opens the book ---- */
      function openBook() {
        if (st.opened || st.shooting) return;
        st.opened = true;
        if (ringTween) ringTween.kill();
        clearInterval(dustTimer);
        gsap.to(ui, { autoAlpha: 0, y: -10, duration: .35 });
        if (st.phase === "prompt" || st.phase === "idle") {
          if (st.phase === "prompt") {
            st.phase = "opening";
            E.fx.burst(innerWidth / 2, innerHeight * .52, 34, 1.1);
            gsap.fromTo(light, { opacity: 0 }, { opacity: .55, duration: .25, yoyo: true, repeat: 1, ease: "power1.out" });
            video.playbackRate = 1.1;
            var p = video.play();
            if (p && p.catch) p.catch(function () { shoot(true); });
          }
        }
      }

      function onClick(e) {
        if (e.target.closest && e.target.closest("#skipIntro")) return;
        if (st.phase === "idle" || st.phase === "prompt") openBook();
      }
      function onKey(e) {
        if (document.body.dataset.stage !== "intro") return;
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); openBook(); }
        else if (e.key === "Escape") shoot(true);
      }
      function onWheel() { if (st.phase === "prompt") openBook(); }
      function onCtx(e) { e.preventDefault(); }
      intro.addEventListener("click", onClick);
      intro.addEventListener("wheel", onWheel, { passive: true });
      intro.addEventListener("contextmenu", onCtx);
      document.addEventListener("keydown", onKey);

      function cleanup() {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("keydown", onKey);
        intro.removeEventListener("click", onClick);
        intro.removeEventListener("wheel", onWheel);
        intro.removeEventListener("contextmenu", onCtx);
        clearInterval(dustTimer); if (ringTween) ringTween.kill();
      }

      function shoot(quick) {
        if (st.shooting) return; st.shooting = true; active = false;
        cancelAnimationFrame(raf); cleanup();
        if (!video.paused || video.currentTime < .1) { /* keep playing */ } 
        else { var q = video.play(); if (q && q.catch) q.catch(function () {}); }
        gsap.to([skip, ui, glow], { autoAlpha: 0, duration: .25 });
        var d = quick ? .8 : 1.7;
        tl = gsap.timeline();
        tl.to(stage, { scale: quick ? 2.4 : 5.6, x: 0, y: 0, duration: d + .35, ease: "power3.in" }, 0)
          .to(light, { opacity: 1, duration: .55, ease: "power2.in" }, d - .45)
          .to(paper, { opacity: 1, duration: .45, ease: "power1.out" }, d + .05)
          .add(function () {
            video.pause();
            if (onCovered) onCovered();
            E.fx.burst(innerWidth / 2, innerHeight * .5, 46, 1.5);
            E.fx.shower(50);
            resolve();                       /* home starts revealing now */
          }, d + .5)
          .to(intro, { opacity: 0, duration: 1, ease: "power1.inOut" }, d + .55)
          .set(intro, { display: "none" });
      }

      skip.addEventListener("click", function () { shoot(true); }, { once: true });
      video.addEventListener("ended", function () { if (st.opened) shoot(false); else showPrompt(); }, { once: true });

      var p = video.play();
      if (p && p.catch) p.catch(function () {          /* autoplay blocked → show the cover and wait for a tap */
        video.currentTime = 0; st.phase = "idle"; showPrompt(); st.phase = "prompt";
      });
      raf = requestAnimationFrame(tick);
    });
  }

  /* put the intro back to its initial state (used by "Replay intro") */
  function reset() {
    active = false; cancelAnimationFrame(raf); clearInterval(dustTimer);
    if (ringTween) ringTween.kill(); if (tl) tl.kill();
    gsap.killTweensOf([stage, ui, glow, light, paper, skip, intro]);
    gsap.set([intro, stage, ui, glow, light, paper, skip], { clearProps: "all" });
    gsap.set(ring, { clearProps: "all" });
    video.playbackRate = 1;
    resetState();
  }

  E.intro = { play: play, reset: reset };
})();
