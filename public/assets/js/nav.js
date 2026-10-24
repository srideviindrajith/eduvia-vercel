/* Navigation — builds the menu, marks the active route and fades the header in with a little magic dust */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.getElementById("mainNav");

  /* build the menu (Home + categories) */
  function buildNav() {
    var items = [{ slug: "home", name: "Home" }].concat(E.CATEGORIES);
    nav.innerHTML = items.map(function (it) {
      var href = it.slug === "home" ? "#/" : "#/" + it.slug;
      return '<a class="nav-link" href="' + href + '" data-route="' + it.slug + '"><span>' + it.name + '</span></a>';
    }).join("");
  }

  function setActive(slug) {
    nav.querySelectorAll(".nav-link").forEach(function (a) {
      var on = a.dataset.route === slug;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  /* header entrance: brand, then each menu item in turn, then the actions */
  function appear() {
    return new Promise(function (resolve) {
      var brand = document.querySelector(".brand"), actions = document.querySelector(".nav-actions");
      var items = Array.prototype.slice.call(nav.querySelectorAll(".nav-link"));
      if (reduce) { gsap.set([brand, actions].concat(items), { opacity: 1 }); resolve(); return; }

      gsap.fromTo(brand, { opacity: 0, y: -18, scale: .85 }, { opacity: 1, y: 0, scale: 1, duration: .8, ease: "back.out(1.8)", delay: .1 });
      var br = brand.getBoundingClientRect(); E.fx.burst(br.left + 24, br.top + br.height / 2, 16, .7);

      items.forEach(function (el, i) {
        gsap.fromTo(el, { opacity: 0, y: -16, scale: .8 },
          { opacity: 1, y: 0, scale: 1, duration: .7, ease: "back.out(1.9)", delay: .3 + i * .1,
            onStart: function () { var r = el.getBoundingClientRect(); E.fx.burst(r.left + r.width / 2, r.top + r.height / 2, 8, .5); } });
      });
      gsap.fromTo(actions, { opacity: 0, scale: .7, y: -10 }, { opacity: 1, scale: 1, y: 0, duration: .7, ease: "back.out(2)", delay: .3 + items.length * .1 });
      setTimeout(resolve, 300 + items.length * 100 + 700);
    });
  }

  E.nav = { buildNav: buildNav, setActive: setActive, appear: appear };
})();
