/* Views — HTML templates for the home page and each category page */
(function () {
  var E = (window.Eduvia = window.Eduvia || {});

  function style(c) { return '--c1:' + c.c1 + ';--c2:' + c.c2; }
  function hours(list) { var m = list.reduce(function (a, c) { return a + c.minutes; }, 0); return (m / 60).toFixed(1).replace(/\.0$/, ""); }

  function tile(c) {
    var n = E.coursesIn(c.slug).length;
    return '<a class="tile rv" href="#/' + c.slug + '" data-route="' + c.slug + '" style="' + style(c) + '">' +
      '<svg class="t-star"><use href="#compass"/></svg>' +
      '<span class="t-ico"><svg class="ico"><use href="#' + c.icon + '"/></svg></span>' +
      '<h3>' + c.name + '</h3><p>' + c.tagline + '</p>' +
      '<span class="t-count">' + n + ' video lessons<svg class="ico"><use href="#i-arrow"/></svg></span></a>';
  }

  /* courses the learner enrolled in or saved (kept in localStorage) */
  function shelfSection() {
    var ids = E.store.get("enrolled").concat(E.store.get("saved")), seen = {}, list = [];
    ids.forEach(function (id) { if (!seen[id] && E.course(id)) { seen[id] = 1; list.push(E.course(id)); } });
    if (!list.length) return "";
    return '<section class="section" style="padding-bottom:0"><div class="wrap">' +
      '<div class="section-head"><div><span class="eyebrow rv"><svg class="ico"><use href="#i-sparkle"/></svg>Your learning shelf</span>' +
        '<h2 class="rv">Pick up where you left off</h2></div>' +
        '<span class="shelf-note rv"><svg class="ico"><use href="#i-bookmark"/></svg>' + list.length + (list.length === 1 ? " course" : " courses") + ' saved on this device</span></div>' +
      '<div class="grid">' + list.map(E.cards.html).join("") + '</div></div></section>';
  }

  function faqSection() {
    var qa = [
      ["How do the video lessons work?", "Every course is a short series of video lessons. Open any card to preview it, then enrol to follow the lessons in order."],
      ["Can I learn at my own pace?", "Yes. Pause, replay and come back whenever you like — your enrolled and saved courses wait on your learning shelf."],
      ["Which subjects can I learn?", "Mathematics, Science, Coding, Languages, Arts & Design and Exam Prep — with more on the way."],
      ["How do I save a course for later?", "Open a course and tap “Save for later”. It will appear on your learning shelf at the top of the home page."]
    ];
    return '<section class="section" style="padding-top:0"><div class="wrap faq-wrap">' +
      '<div class="section-head"><div><span class="eyebrow rv"><svg class="ico"><use href="#i-sparkle"/></svg>Good to know</span>' +
        '<h2 class="rv">Questions, answered</h2></div></div>' +
      '<div class="faq-list">' + qa.map(function (x) {
        return '<div class="faq rv"><button class="faq-q" type="button" aria-expanded="false"><span>' + x[0] + '</span><svg class="ico"><use href="#i-plus"/></svg></button>' +
          '<div class="faq-a" role="region"><p>' + x[1] + '</p></div></div>';
      }).join("") + '</div></div></section>';
  }

  function home() {
    var all = E.COURSES, cats = E.CATEGORIES;
    var featured = cats.map(function (c) { return E.coursesIn(c.slug)[0]; });
    var lessons = all.reduce(function (a, c) { return a + c.lessons; }, 0);

    var badges = cats.map(function (c, i) {
      return '<div class="orbit-badge" style="--a:' + (i * 60 - 90) + 'deg;--i:' + i + '"><div>' +
        '<a class="chip" href="#/' + c.slug + '" data-route="' + c.slug + '" aria-label="' + c.name + '"><svg class="ico"><use href="#' + c.icon + '"/></svg></a>' +
        '<small>' + c.name.split(" ")[0] + '</small></div></div>';
    }).join("");

    return '' +
    '<section class="hero"><div class="wrap hero-grid">' +
      '<div class="hero-copy">' +
        '<span class="eyebrow rv"><svg class="ico"><use href="#i-sparkle"/></svg>Eduvia · The art of learning</span>' +
        '<h1 class="rv">Open the book.<br><em>Begin your story</em><br>of learning.</h1>' +
        '<p class="hero-sub rv">Bite-sized, beautifully made video lessons in maths, science, coding, languages, arts and exam prep — learn at your own pace, anywhere.</p>' +
        '<div class="hero-cta rv">' +
          '<button class="btn btn-primary btn-lg" type="button" data-scroll="#featured"><span>Start learning</span><svg class="ico"><use href="#i-arrow"/></svg></button>' +
          '<button class="btn btn-ghost btn-lg" type="button" data-action="replay"><svg class="ico"><use href="#i-play"/></svg><span>Watch intro</span></button>' +
        '</div>' +
        '<div class="stats rv">' +
          '<div class="stat"><b data-count="' + all.length + '">0</b><span>Video courses</span></div>' +
          '<div class="stat"><b data-count="' + lessons + '">0</b><span>Lessons</span></div>' +
          '<div class="stat"><b data-count="' + cats.length + '">0</b><span>Subjects</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="orbit rv" aria-label="Browse subjects"><div class="orbit-glow"></div><div class="orbit-ring"></div><div class="orbit-ring r2"></div>' +
        '<div class="orbit-core"><svg aria-hidden="true"><use href="#compass"/></svg></div><div class="orbit-spin">' + badges + '</div></div>' +
    '</div></section>' +

    shelfSection() +

    '<section class="section" id="featured"><div class="wrap">' +
      '<div class="section-head"><div><span class="eyebrow rv"><svg class="ico"><use href="#i-sparkle"/></svg>Featured lessons</span>' +
        '<h2 class="rv">Start with a story worth watching</h2><p class="rv">One handpicked video course from every subject — jump in anywhere.</p></div></div>' +
      '<div class="grid">' + featured.map(E.cards.html).join("") + '</div>' +
    '</div></section>' +

    '<section class="section" style="padding-top:0"><div class="wrap">' +
      '<div class="section-head"><div><span class="eyebrow rv"><svg class="ico"><use href="#i-sparkle"/></svg>Choose your path</span>' +
        '<h2 class="rv">Pick a subject, step through the page</h2></div></div>' +
      '<div class="tiles">' + cats.map(tile).join("") + '</div>' +
    '</div></section>' +

    '<section class="section" style="padding-top:0"><div class="wrap">' +
      '<div class="section-head"><div><span class="eyebrow rv"><svg class="ico"><use href="#i-sparkle"/></svg>Why Eduvia</span>' +
        '<h2 class="rv">Learning, the way it should feel</h2></div></div>' +
      '<div class="features">' +
        '<div class="feature rv"><div class="f-ico"><svg class="ico"><use href="#i-play"/></svg></div><h3>Bite-sized videos</h3><p>Short, focused lessons you can finish in one sitting — no long lectures, no fluff.</p></div>' +
        '<div class="feature rv"><div class="f-ico"><svg class="ico"><use href="#i-path"/></svg></div><h3>Your own pace</h3><p>Pause, replay and revisit any lesson. Save courses for later and pick up where you left off.</p></div>' +
        '<div class="feature rv"><div class="f-ico"><svg class="ico"><use href="#i-users"/></svg></div><h3>Friendly mentors</h3><p>Clear explanations from teachers who love their subject and make hard ideas feel simple.</p></div>' +
      '</div>' +
    '</div></section>' +

    faqSection() +

    '<section class="section" style="padding-top:0"><div class="wrap">' +
      '<div class="cta-band rv"><svg class="c-star a"><use href="#compass"/></svg><svg class="c-star b"><use href="#compass"/></svg>' +
        '<span class="eyebrow"><svg class="ico"><use href="#i-sparkle"/></svg>Free to join</span>' +
        '<h2>Your next chapter starts today</h2><p>Create a free account and get new lessons, study tips and learning paths delivered to you.</p>' +
        '<button class="btn btn-gold btn-lg" type="button" data-action="join"><span>Join Eduvia free</span><svg class="ico"><use href="#i-arrow"/></svg></button>' +
      '</div>' +
    '</div></section>';
  }

  function category(slug) {
    var c = E.cat(slug), list = E.coursesIn(slug);
    var levels = E.LEVELS.filter(function (l) { return list.some(function (x) { return x.level === l; }); });
    var others = E.CATEGORIES.filter(function (x) { return x.slug !== slug; }).slice(0, 3);
    return '' +
    '<section class="cat-hero"><div class="wrap"><div class="cat-banner rv" style="' + style(c) + '">' +
      '<div><div class="crumbs"><a href="#/" data-route="home">Home</a><span>›</span><span>' + c.name + '</span></div>' +
        '<h1>' + c.name + '</h1><p>' + c.blurb + '</p>' +
        '<div class="cat-meta"><span><svg class="ico"><use href="#i-play"/></svg>' + list.length + ' courses</span>' +
          '<span><svg class="ico"><use href="#i-layers"/></svg>' + list.reduce(function (a, x) { return a + x.lessons; }, 0) + ' lessons</span>' +
          '<span><svg class="ico"><use href="#i-clock"/></svg>' + hours(list) + ' hours</span></div></div>' +
      '<svg class="ico cb-ico"><use href="#' + c.icon + '"/></svg>' +
    '</div></div></section>' +

    '<section class="section" style="padding-top:0"><div class="wrap">' +
      '<div class="filters rv" role="group" aria-label="Filter by level" data-slug="' + slug + '"><span class="f-label">Level</span>' +
        '<button class="chipbtn is-on" type="button" data-level="all">All</button>' +
        levels.map(function (l) { return '<button class="chipbtn" type="button" data-level="' + l + '">' + l + '</button>'; }).join("") + '</div>' +
      '<div class="grid" id="catGrid">' + list.map(E.cards.html).join("") + '</div>' +
    '</div></section>' +

    '<section class="section more-cats" style="padding-top:0"><div class="wrap">' +
      '<div class="section-head"><div><span class="eyebrow rv"><svg class="ico"><use href="#i-sparkle"/></svg>Keep exploring</span>' +
        '<h2 class="rv">Turn the page to another subject</h2></div></div>' +
      '<div class="tiles">' + others.map(tile).join("") + '</div>' +
    '</div></section>';
  }

  E.views = { home: home, category: category };
})();
