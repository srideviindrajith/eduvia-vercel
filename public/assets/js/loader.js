/* Custom loader — preloads the intro video + fonts while a compass and ink line show progress */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});
  var video = document.getElementById("introVideo");
  var loaderEl = document.getElementById("loader");
  var ring = document.getElementById("ldRing"), bar = document.getElementById("ldBar");
  var pct = document.getElementById("ldPct"), tip = document.getElementById("ldTip");

  var VIDEO_SRC = E.INTRO_SRC || "assets/video/intro.mp4";
  var VIDEO_ALT = "assets/video/intro.webm";
  var MIN_MS = 2600;
  var TIPS = [
    "Opening the book of knowledge…",
    "Preparing the pages…",
    "Dusting off the old pages…",
    "Gathering today's lessons…",
    "Lighting the lamps of curiosity…",
    "Almost there — the story begins…"
  ];

  var tween = { v: 0 }, target = 0, tipTimer = null;

  function render() {
    var v = tween.v;
    pct.textContent = Math.round(v) + "%";
    bar.style.width = v + "%";
    ring.style.strokeDashoffset = 339.3 * (1 - v / 100);
  }
  function setTarget(t) {
    target = Math.max(target, Math.min(100, t));
    gsap.to(tween, { v: target, duration: .7, ease: "power1.out", overwrite: true, onUpdate: render });
  }

  function startTips() {
    var i = 0;
    tipTimer = setInterval(function () {
      i = (i + 1) % TIPS.length;
      tip.classList.add("swap");
      setTimeout(function () { tip.textContent = TIPS[i]; tip.classList.remove("swap"); }, 280);
    }, 1100);
  }

  /* try to download the video with real progress; falls back to a plain <video src> (e.g. when opened via file://) */
  function loadVideo() {
    return new Promise(function (resolve) {
      var settled = false;
      function finish(ok) { if (!settled) { settled = true; resolve(ok); } }
      setTimeout(function () { finish(!!video.src); }, 12000);

      function direct(src) {
        var simulated = setInterval(function () { setTarget(Math.min(80, target + 6)); }, 250);
        function stop(ok) { clearInterval(simulated); finish(ok); }
        video.addEventListener("canplaythrough", function () { stop(true); }, { once: true });
        video.addEventListener("loadeddata", function () { stop(true); }, { once: true });
        video.addEventListener("error", function () {
          if (src !== VIDEO_ALT) { direct(VIDEO_ALT); } else { stop(false); }
        }, { once: true });
        video.src = src; video.load();
      }

      if (!window.fetch || location.protocol === "file:") { direct(VIDEO_SRC); return; }

      fetch(VIDEO_SRC).then(function (res) {
        if (!res.ok || !res.body) throw new Error("no stream");
        var total = +res.headers.get("content-length") || 0, got = 0, chunks = [], reader = res.body.getReader();
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) return new Blob(chunks, { type: "video/mp4" });
            chunks.push(r.value); got += r.value.length;
            setTarget(total ? (got / total) * 82 : Math.min(80, target + 4));
            return pump();
          });
        }
        return pump();
      }).then(function (blob) {
        video.addEventListener("loadeddata", function () { finish(true); }, { once: true });
        video.addEventListener("error", function () { direct(VIDEO_ALT); }, { once: true });
        video.src = URL.createObjectURL(blob); video.load();
      }).catch(function () { direct(VIDEO_SRC); });
    });
  }

  function run() {
    startTips();
    var t0 = performance.now();
    var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    return Promise.all([loadVideo(), fonts.then(function () { setTarget(Math.max(target, 88)); })]).then(function (r) {
      var wait = Math.max(0, MIN_MS - (performance.now() - t0));
      return new Promise(function (res) { setTimeout(function () { res(r[0]); }, wait); });
    }).then(function (ok) {
      setTarget(100);
      tip.textContent = "Ready ✦";
      return new Promise(function (res) { setTimeout(function () { res(ok); }, 650); });
    });
  }

  /* open like a book: doors slide apart, calling onOpen() so the intro video starts behind them */
  function exit(onOpen) {
    clearInterval(tipTimer);
    return new Promise(function (resolve) {
      var tl = gsap.timeline({ onComplete: function () { loaderEl.style.display = "none"; resolve(); } });
      tl.to(".ld-center", { scale: 1.12, opacity: 0, duration: .6, ease: "power2.in" }, 0)
        .to(".ld-seam", { scaleY: 1, opacity: 1, width: 6, duration: .35 }, .25)
        .add(function () { if (onOpen) onOpen(); }, .55)
        .to(".ld-door--l", { xPercent: -101, duration: 1.2, ease: "power3.inOut" }, .6)
        .to(".ld-door--r", { xPercent: 101, duration: 1.2, ease: "power3.inOut" }, .6)
        .to(".ld-seam", { opacity: 0, duration: .5 }, .9);
    });
  }

  E.loader = { run: run, exit: exit };
})();
