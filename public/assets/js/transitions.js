/* Page transition — a parchment circle blooms from the touched menu item, magic dust falls,
   the new category's name appears, then the page lifts away upward to reveal the new content. */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var veil = document.getElementById("veil");
  var paper = veil.querySelector(".veil-paper"), ring = veil.querySelector(".veil-ring");
  var card = veil.querySelector(".veil-card");
  var elIcon = document.getElementById("veilIcon"), elKick = document.getElementById("veilKicker");
  var elTitle = document.getElementById("veilTitle"), elSub = document.getElementById("veilSub");
  var busy = false;

  /* o: { x, y, title, sub, kicker, icon, swap(), onReveal() } → resolves when new page is mostly visible */
  function go(o) {
    return new Promise(function (resolve) {
      if (busy) { resolve(); return; }
      busy = true;

      if (reduce) {
        o.swap && o.swap(); window.scrollTo(0, 0);
        busy = false; resolve(); return;
      }

      var W = innerWidth, H = innerHeight;
      var x = o.x == null ? W / 2 : o.x, y = o.y == null ? H / 2 : o.y;
      var R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 24;

      elKick.textContent = o.kicker || "Opening";
      elTitle.innerHTML = String(o.title).split("").map(function (ch) {
        return "<span>" + (ch === " " ? "&nbsp;" : ch) + "</span>";
      }).join("");
      elSub.textContent = o.sub || "";
      elIcon.setAttribute("href", "#" + (o.icon || "i-book"));

      veil.className = "on";
      gsap.set(veil, { "--p": 0 });
      gsap.set(paper, { clipPath: "circle(0px at " + x + "px " + y + "px)" });
      gsap.set(ring, { left: x - R, top: y - R, width: 2 * R, height: 2 * R, scale: 0, opacity: 1 });
      gsap.set(card.children, { opacity: 0, y: 18 });
      gsap.set(elTitle.children, { opacity: 0, y: 26 });

      var tl = gsap.timeline({
        onComplete: function () { veil.className = ""; gsap.set(paper, { clearProps: "clipPath" }); busy = false; }
      });

      tl.to(paper, { clipPath: "circle(" + R + "px at " + x + "px " + y + "px)", duration: .75, ease: "power3.inOut" }, 0)
        .to(ring, { scale: 1, duration: .75, ease: "power3.inOut" }, 0)
        .to(ring, { opacity: 0, duration: .25 }, .6)
        .add(function () { E.fx.burst(x, y, 28, 1.1); E.fx.shower(34); }, .05)
        .to([elIcon.parentNode, elKick, elTitle, elSub], { opacity: 1, y: 0, duration: .5, ease: "power2.out", stagger: .07 }, .45)
        .to(elTitle.children, { opacity: 1, y: 0, duration: .55, ease: "back.out(1.6)", stagger: .035 }, .5)
        .add(function () {                              /* page is fully covered → swap content */
          o.swap && o.swap();
          window.scrollTo(0, 0);
          gsap.set(paper, { clearProps: "clipPath" });
          veil.classList.add("wipe");
        }, 1.2)
        .to(card.children, { opacity: 0, y: -16, duration: .35, ease: "power2.in" }, 1.2)
        .to(veil, { "--p": 1, duration: .85, ease: "power2.inOut" }, 1.25)
        .add(function () { resolve(); }, 1.6);
    });
  }

  E.transition = { go: go, isBusy: function () { return busy; } };
})();
