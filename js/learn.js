/* Angler's Fly Boxes - Learn: approaches, My System quiz, Box Finder, box styles, Fly Guide (ES5 only) */
(function () {
  "use strict";
  var A = window.AFB, D = A.D, esc = A.esc;

  function ctxNow() {
    var w = A.state.profile.water;
    return (w && w !== "mix") ? w : "trout";
  }
  function ctxChips() {
    var h = '<div class="chips">', cur = ctxNow();
    for (var i = 0; i < D.contexts.length; i++) {
      h += '<button type="button" class="chip' + (cur === D.contexts[i].id ? " on" : "") + '" data-action="set-water" data-water="' + D.contexts[i].id + '">' + esc(D.contexts[i].short) + "</button>";
    }
    return h + "</div>";
  }
  function approachCard(a) {
    return '<div class="card tap" data-go="#approach/' + a.id + '"><div class="card-row"><div class="card-ico">' + a.icon + '</div><div class="card-body"><h3>' + esc(a.name) + "</h3>" +
      '<p class="small muted" style="margin:0">' + esc(a.short) + '</p></div><div class="chev">&#8250;</div></div></div>';
  }
  function styleChip(st) {
    return '<a class="style-chip" href="#style/' + st.id + '">' + A.boxImg(st.id, "chip-box") + esc(st.name) + "</a>";
  }

  /* ======================= LEARN ======================= */
  function viewLearn() {
    var h = "<h1>Learn</h1>";
    h += '<div class="card accent"><h3>Start with your water, your fish, and what they eat</h3>' +
      "<p style=\"margin:0\">The flies worth carrying are the ones that match the likely food where you're fishing, at that time of year. Then add a few confidence flies and attractors you trust for prospecting.</p></div>";
    var r = A.state.quiz.step >= D.quiz.length ? quizResult() : null;
    h += '<div class="grid2">';
    h += '<div class="card tap hero-card" data-go="#quiz"><div class="card-row"><div class="card-ico">🧭</div><div class="card-body"><h3>Help me organize</h3><p class="small muted" style="margin:0">' +
      (r ? "Your setup: " + esc(r.group.name) + (r.carry ? " + " + esc(r.carry.name) : "") : "5 quick questions. Get a setup that fits how and where you fish.") + '</p></div><div class="chev">&#8250;</div></div></div>';
    h += '<div class="card tap hero-card" data-go="#finder"><div class="card-row">' + A.boxImg("compartment", "card-img") + '<div class="card-body"><h3>Box Finder</h3><p class="small muted" style="margin:0">Which kind of fly box fits your flies and how you carry them?</p></div><div class="chev">&#8250;</div></div></div>';
    h += "</div>";
    h += '<div class="ctx-row"><span class="small muted">Show examples for</span>' + ctxChips() + "</div>";
    var groups = [["group", "How to group your flies", "Pick one. This is how your main boxes are arranged."],
      ["carry", "What to take on the water", "Pick one. This is how much you carry while fishing."],
      ["finish", "Finishing touches", "Optional. They work with any setup."]];
    for (var g = 0; g < groups.length; g++) {
      h += '<div class="section-label">' + groups[g][1] + '</div><p class="small muted sub">' + groups[g][2] + '</p><div class="grid2">';
      for (var i = 0; i < D.approaches.length; i++) { if (D.approaches[i].dim === groups[g][0]) { h += approachCard(D.approaches[i]); } }
      h += "</div>";
    }
    h += '<div class="section-label">Good to know</div><div class="card"><ul class="clean">' +
      "<li><b>Mix and match.</b> Group your main boxes one way and carry a day box another. Most anglers combine approaches.</li>" +
      "<li><b>More boxes isn't better.</b> Lots of anglers end up hunting through a pile of boxes for one fly.</li>" +
      "<li><b>Your system will change.</b> New waters and new fish change what you carry.</li>" +
      "<li><b>Fish don't read labels.</b> A fly tied for one water can still work somewhere else.</li>" +
      "</ul></div>";
    h += '<p class="footer-note">Angler\'s Fly Boxes ' + D.version + " · ARTEZIQ</p>";
    return h;
  }

  /* ======================= APPROACH ======================= */
  function viewApproach(parts) {
    var a = A.approach(parts[1]);
    if (!a) { return viewLearn(); }
    var i, dimName = { group: "How to group your flies", carry: "What to take on the water", finish: "Finishing touch (optional)" }[a.dim];
    var h = '<a class="back" href="#learn">&#8249; Learn</a>';
    h += '<div class="card-row"><div class="card-ico">' + a.icon + '</div><div class="card-body"><h1 style="margin-top:2px">' + esc(a.name) + "</h1></div></div>";
    h += '<p><span class="pill deep">' + dimName + '</span></p><p class="lead">' + esc(a.short) + "</p><p>" + esc(a.idea) + "</p>";
    h += "<h2>What it looks like</h2>";
    if (!a.layouts.all) { h += '<div class="ctx-row"><span class="small muted">Examples for</span>' + ctxChips() + "</div>"; }
    var lays = A.layoutsFor(a, ctxNow());
    h += '<div class="grid2 layouts">';
    for (i = 0; i < lays.length; i++) { h += '<div class="layout-cell">' + A.layoutVisual(lays[i]) + "</div>"; }
    h += '</div><p class="small muted">Examples, not exact box sizes. Each section can be one side, a few rows or a compartment, so four sections fit fine in a two-sided box.</p>';
    h += '<h2>How to set it up</h2><div class="card"><ol class="clean">';
    for (i = 0; i < a.steps.length; i++) { h += "<li>" + esc(a.steps[i]) + "</li>"; }
    h += "</ol></div>";
    h += '<div class="two-col"><div><h2>Pros</h2><div class="card"><ul class="clean pros">';
    for (i = 0; i < a.pros.length; i++) { h += "<li>" + esc(a.pros[i]) + "</li>"; }
    h += '</ul></div></div><div><h2>Watch-outs</h2><div class="card"><ul class="clean cons">';
    for (i = 0; i < a.cons.length; i++) { h += "<li>" + esc(a.cons[i]) + "</li>"; }
    h += "</ul></div></div></div>";
    h += '<div class="card accent"><h3>Best for</h3><p style="margin:0">' + esc(a.best) + "</p></div>";
    if (a.boxes && a.boxes.length) {
      h += '<h2>Boxes that suit it</h2><div class="style-chips">';
      for (i = 0; i < a.boxes.length; i++) { var bs = A.boxStyle(a.boxes[i]); if (bs) { h += styleChip(bs); } }
      h += "</div>";
    }
    if (a.dim !== "finish") {
      h += '<button class="btn block" data-action="apply-approach" data-id="' + a.id + '">Create these as empty boxes</button>';
      h += '<p class="small muted center">No flies are added. You add the flies you actually own.</p>';
    } else {
      h += '<a class="btn block" href="#boxes">Go to My Boxes</a>';
    }
    return h;
  }
  A.actions["apply-approach"] = function (el) {
    var a = A.approach(el.getAttribute("data-id"));
    var n = A.createBoxes(A.layoutsFor(a, ctxNow()), a.id);
    A.toast(A.count(n, "empty box", "empty boxes") + " added to My Boxes");
    A.go("#boxes");
  };

  /* ======================= QUIZ ======================= */
  function ans(id) { return A.state.quiz.answers[id]; }
  function answerText(qid) {
    var q = A.byId(D.quiz, qid), a = q ? A.byId(q.a, ans(qid)) : null;
    return a ? a.t : "";
  }
  function quizResult() {
    var where = ans("where"), boxes = ans("boxes"), plan = ans("plan"), exp = ans("exp"), pain = ans("pain");
    var carry = null, carryWhy = "", group, groupWhy;
    if (boxes === "one") { carry = "forage"; carryWhy = "You want just one box on the water."; }
    else if (pain === "carry" && plan !== "no") { carry = "puck"; carryWhy = "You carry too much, and you plan ahead, so take only today's flies in a day box."; }
    else if (pain === "carry") { carry = "forage"; carryWhy = "You carry too much, so one box with just the essentials."; }
    else if (plan === "yes" || plan === "some") { carry = "puck"; carryWhy = "You plan before trips, so packing a day box is easy."; }
    else { carryWhy = "You rarely plan ahead, so grab the box for the water you're fishing."; }

    if (where === "mix") { group = "water"; groupWhy = "You fish very different waters, so give each its own box."; }
    else if (exp === "new") { group = "type"; groupWhy = "You're new, and sorting by fly type teaches the fly families."; }
    else if (pain === "find") { group = "type"; groupWhy = "Clear categories make any fly easy to find."; }
    else if (where === "salt") { group = "water"; groupWhy = "Open water and the flats call for different flies."; }
    else if (pain === "which" || (plan === "yes" && exp === "many")) { group = "hatch"; groupWhy = "You think about what fish are eating, so group by season."; }
    else if (!carry) { group = "water"; groupWhy = "Grab-and-go works best with one box per water."; }
    else { group = "type"; groupWhy = "Grouping by fly type keeps your main boxes simple."; }

    var ctx = where === "mix" || !where ? "trout" : where;
    var tip = pain === "runout" ? "Keep counts in My Boxes. Any fly down to 1 shows up on your restock list." :
      (pain === "find" ? "Use short labels and the search box in My Boxes." : "");
    return { group: A.approach(group), groupWhy: groupWhy, carry: carry ? A.approach(carry) : null, carryWhy: carryWhy, ctx: ctx, tip: tip };
  }

  function viewQuiz() {
    var step = A.state.quiz.step || 0, h = '<a class="back" href="#learn">&#8249; Learn</a>', i;
    if (step < D.quiz.length) {
      var q = D.quiz[step];
      h += "<h1>Help me organize</h1>";
      h += '<div class="progress"><div style="width:' + Math.round((step / D.quiz.length) * 100) + '%"></div></div>';
      h += '<p class="small muted">Question ' + (step + 1) + " of " + D.quiz.length + "</p><h2>" + esc(q.q) + "</h2>" + (q.note ? '<p class="small muted">' + esc(q.note) + "</p>" : "");
      for (i = 0; i < q.a.length; i++) {
        h += '<button class="choice' + (ans(q.id) === q.a[i].id ? " sel" : "") + '" data-action="quiz-answer" data-q="' + q.id + '" data-a="' + q.a[i].id + '">' + esc(q.a[i].t) + "</button>";
      }
      if (step > 0) { h += '<button class="btn ghost sm" data-action="quiz-back">&#8249; Back</button>'; }
      return h;
    }
    var r = quizResult();
    h += "<h1>Your setup</h1>";
    h += '<div class="card result-top">';
    h += '<div class="setup-step"><span class="num">1</span><div><p class="small muted" style="margin:0">Arrange your main boxes</p><h3>' + r.group.icon + " " + esc(r.group.name) + '</h3><p class="small" style="margin:0">' + esc(r.groupWhy) + "</p></div></div>";
    h += '<div class="setup-step"><span class="num">2</span><div><p class="small muted" style="margin:0">On the water</p><h3>' +
      (r.carry ? r.carry.icon + " " + esc(r.carry.name) : "🌊 The box for that water") + '</h3><p class="small" style="margin:0">' + esc(r.carryWhy) + "</p></div></div>";
    if (r.tip) { h += '<p class="small" style="margin:10px 0 0"><b>Tip:</b> ' + esc(r.tip) + "</p>"; }
    h += "</div>";
    var show = r.carry || r.group, lays = A.layoutsFor(show, r.ctx);
    h += "<h2>Example for " + esc(A.context(r.ctx).name.toLowerCase()) + '</h2><div class="grid2 layouts">';
    for (i = 0; i < lays.length; i++) { h += '<div class="layout-cell">' + A.layoutVisual(lays[i]) + "</div>"; }
    h += "</div>";
    h += '<button class="btn block" data-action="apply-setup">Create these as empty boxes</button><p class="small muted center">No flies are added. Rename or change any section later.</p>';
    h += '<div class="btn-row"><a class="btn sm ghost" href="#approach/' + r.group.id + '">More on ' + esc(r.group.name) + "</a>" +
      (r.carry ? '<a class="btn sm ghost" href="#approach/' + r.carry.id + '">More on ' + esc(r.carry.name) + "</a>" : "") + "</div>";
    h += '<div class="section-label">What shaped this</div><div class="card"><ul class="clean">';
    for (i = 0; i < D.quiz.length; i++) { h += "<li>" + esc(D.quiz[i].q) + " <b>" + esc(answerText(D.quiz[i].id)) + "</b></li>"; }
    h += '</ul><p class="small muted" style="margin:0">This is a starting point, not a rule. Change anything that doesn\'t fit.</p></div>';
    h += '<button class="btn ghost block" data-action="quiz-reset">Start over</button>';
    return h;
  }
  A.actions["quiz-answer"] = function (el) {
    var q = el.getAttribute("data-q"), a = el.getAttribute("data-a");
    A.state.quiz.answers[q] = a;
    if (q === "where") { A.state.profile.water = a; }
    A.state.quiz.step = (A.state.quiz.step || 0) + 1;
    A.save(); A.route(); window.scrollTo(0, 0);
  };
  A.actions["quiz-back"] = function () { A.state.quiz.step = Math.max(0, (A.state.quiz.step || 0) - 1); A.save(); A.route(); };
  A.actions["quiz-reset"] = function () { A.state.quiz = { step: 0, answers: {} }; A.save(); A.route(); window.scrollTo(0, 0); };
  A.actions["apply-setup"] = function () {
    var r = quizResult(), show = r.carry || r.group;
    var n = A.createBoxes(A.layoutsFor(show, r.ctx), show.id);
    A.toast(A.count(n, "empty box", "empty boxes") + " added to My Boxes");
    A.go("#boxes");
  };

  /* ======================= BOX FINDER ======================= */
  function scoreFinder() {
    var scores = {}, fits = {}, i, k;
    for (i = 0; i < D.boxStyles.length; i++) { scores[D.boxStyles[i].id] = 0; fits[D.boxStyles[i].id] = []; }
    for (i = 0; i < D.boxFinder.length; i++) {
      var ai = A.state.finder.answers[D.boxFinder[i].id];
      if (ai == null) { continue; }
      var a = D.boxFinder[i].a[ai];
      for (k in a.s) { if (a.s.hasOwnProperty(k)) { scores[k] += a.s[k]; } }
      for (k in a.fit) { if (a.fit.hasOwnProperty(k) && fits[k]) { fits[k].push(a.fit[k]); } }
    }
    var ids = [];
    for (k in scores) { if (scores.hasOwnProperty(k)) { ids.push(k); } }
    ids.sort(function (a, b) { return scores[b] - scores[a]; });
    return { scores: scores, fits: fits, ids: ids };
  }
  function resultCard(st, why, top) {
    var h = '<div class="card' + (top ? " result-top" : "") + '"><div class="card-row">' + A.boxImg(st.id, "result-img") + '<div class="card-body"><h2 style="margin:0 0 4px">' + esc(st.name) + "</h2>" +
      '<p style="margin:0">' + esc(st.short) + "</p></div></div>";
    h += '<p class="small" style="margin:10px 0 4px"><b>Why it fits</b></p><ul class="clean small">';
    if (!why.length) { why = ["Holds: " + st.holds]; }
    for (var i = 0; i < why.length; i++) { h += "<li>" + esc(why[i]) + "</li>"; }
    h += "</ul>";
    h += '<div class="btn-row"><button class="btn sm" data-action="own-box" data-style="' + st.id + '">I have one: add it</button>' +
      '<button class="btn sm sand" data-action="shop" data-style="' + st.id + '">Where to buy</button><a class="btn sm ghost" href="#style/' + st.id + '">More</a></div></div>';
    return h;
  }
  function viewFinder() {
    var F = D.boxFinder, step = A.state.finder.step || 0, i;
    var h = '<a class="back" href="#learn">&#8249; Learn</a><h1>Box Finder</h1>';
    if (step < F.length) {
      var q = F[step];
      h += '<p class="muted">Five questions about your flies and how you carry them. We\'ll explain what fits before showing any stores.</p>';
      h += '<div class="progress"><div style="width:' + Math.round((step / F.length) * 100) + '%"></div></div>';
      h += '<p class="small muted">Question ' + (step + 1) + " of " + F.length + "</p><h2>" + esc(q.q) + "</h2>";
      for (i = 0; i < q.a.length; i++) {
        h += '<button class="choice' + (A.state.finder.answers[q.id] === i ? " sel" : "") + '" data-action="finder-answer" data-q="' + q.id + '" data-i="' + i + '">' + esc(q.a[i].t) + "</button>";
      }
      if (step > 0) { h += '<button class="btn ghost sm" data-action="finder-back">&#8249; Back</button>'; }
    } else {
      var r = scoreFinder(), top = A.boxStyle(r.ids[0]), second = A.boxStyle(r.ids[1]);
      var tie = r.scores[r.ids[0]] === r.scores[r.ids[1]];
      h += '<p class="small muted">' + (tie ? "Two strong matches for what you told us." : "Here's what fits what you told us.") + "</p>";
      h += resultCard(top, r.fits[top.id], true);
      h += '<div class="section-label">' + (tie ? "Also a strong match" : "Also a good fit") + "</div>" + resultCard(second, r.fits[second.id], false);
      h += '<p class="small muted">Many boxes combine features, like silicone slots inside a waterproof case. Look for the features above rather than one exact name.</p>';
      var wet = A.state.finder.answers.wet;
      if (wet != null && wet > 0 && D.accessories.length) {
        var acc = D.accessories[0];
        h += '<div class="card"><h3>Pair it with: ' + esc(acc.name) + '</h3><p class="small">' + esc(acc.short) + '</p><button class="btn sm sand" data-action="shop" data-style="' + acc.id + '">Where to buy</button></div>';
      }
      h += '<button class="btn ghost block" data-action="finder-reset">Start over</button>';
    }
    h += '<div class="section-label">All kinds of fly boxes</div><div class="grid2">';
    for (i = 0; i < D.boxStyles.length; i++) {
      var st = D.boxStyles[i];
      h += '<div class="card tap" data-go="#style/' + st.id + '"><div class="card-row">' + A.boxImg(st.id, "card-img") + '<div class="card-body"><h3>' + esc(st.name) + '</h3><p class="small muted" style="margin:0">' + esc(st.short) + '</p></div><div class="chev">&#8250;</div></div></div>';
    }
    h += '</div><p class="footer-note">' + esc(D.shop.disclosure) + "</p>";
    return h;
  }
  A.actions["finder-answer"] = function (el) {
    A.state.finder.answers[el.getAttribute("data-q")] = parseInt(el.getAttribute("data-i"), 10);
    A.state.finder.step = (A.state.finder.step || 0) + 1;
    A.save(); A.route(); window.scrollTo(0, 0);
  };
  A.actions["finder-back"] = function () { A.state.finder.step = Math.max(0, (A.state.finder.step || 0) - 1); A.save(); A.route(); };
  A.actions["finder-reset"] = function () { A.state.finder = { step: 0, answers: {} }; A.save(); A.route(); window.scrollTo(0, 0); };
  A.actions["own-box"] = function (el) {
    var st = A.boxStyle(el.getAttribute("data-style"));
    A.openNewBox(st.id === "puck" ? "puck" : "box", st.id);
  };

  /* ======================= BOX STYLE ======================= */
  function viewStyle(parts) {
    var st = A.boxStyle(parts[1]), i;
    if (!st) { return viewFinder(); }
    var h = '<a class="back" href="#finder">&#8249; Box Finder</a>';
    h += '<div class="style-head">' + A.boxImg(st.id, "style-img") + '<div><h1>' + esc(st.name) + '</h1><p class="lead" style="margin:0">' + esc(st.short) + "</p></div></div>";
    if (st.holds) { h += '<div class="card accent"><h3>Best for holding</h3><p style="margin:0">' + esc(st.holds) + "</p></div>"; }
    if (st.pros) {
      h += '<div class="two-col"><div><h2>Pros</h2><div class="card"><ul class="clean pros">';
      for (i = 0; i < st.pros.length; i++) { h += "<li>" + esc(st.pros[i]) + "</li>"; }
      h += '</ul></div></div><div><h2>Watch-outs</h2><div class="card"><ul class="clean cons">';
      for (i = 0; i < st.cons.length; i++) { h += "<li>" + esc(st.cons[i]) + "</li>"; }
      h += "</ul></div></div></div>";
    }
    if (st.tip) { h += '<div class="card"><h3>Tip</h3><p style="margin:0">' + esc(st.tip) + "</p></div>"; }
    var fits = [];
    for (i = 0; i < D.approaches.length; i++) { if (D.approaches[i].boxes && D.approaches[i].boxes.indexOf(st.id) >= 0) { fits.push(D.approaches[i]); } }
    if (fits.length) {
      h += "<h2>Works well with</h2><p>";
      for (i = 0; i < fits.length; i++) { h += '<a class="pill deep" style="text-decoration:none" href="#approach/' + fits[i].id + '">' + esc(fits[i].name) + "</a>"; }
      h += "</p>";
    }
    h += '<div class="btn-row"><button class="btn" data-action="own-box" data-style="' + st.id + '">I have one: add it</button><button class="btn sand" data-action="shop" data-style="' + st.id + '">Where to buy</button></div>';
    return h;
  }
  function shopUrl(r, st) {
    var u = r.url.replace("{q}", encodeURIComponent(st.q).replace(/%20/g, "+"));
    if (r.params) { u += (u.indexOf("?") >= 0 ? "&" : "?") + r.params.replace(/^[?&]/, ""); }
    if (r.wrap) { u = r.wrap.replace("{url}", encodeURIComponent(u)); }
    return u;
  }
  A.actions.shop = function (el) {
    var st = A.boxStyle(el.getAttribute("data-style"));
    if (!st) { return; }
    var h = "<p>Shopping for a <b>" + esc(st.name) + "</b>. Pick a store:</p>";
    for (var i = 0; i < D.shop.retailers.length; i++) {
      var r = D.shop.retailers[i];
      h += '<a class="choice" style="text-decoration:none" href="' + esc(shopUrl(r, st)) + '" target="_blank" rel="sponsored noopener"><b>' + esc(r.name) + ' &#8599;</b><br><span class="small muted">' + esc(r.note) + "</span></a>";
    }
    h += '<p class="small muted">Look for: ' + esc(st.q) + '.</p><p class="footer-note">' + esc(D.shop.disclosure) + "</p>";
    A.openSheet("Where to buy", h);
  };

  /* ======================= FLY GUIDE ======================= */
  var guideFilter = null;
  function viewGuide() {
    var f = guideFilter || "all", i;
    var h = "<h1>Fly Guide</h1><p class=\"muted\">The main kinds of flies, what they imitate, and how to store them.</p>";
    h += '<div class="chips">';
    var opts = [{ id: "all", short: "All" }].concat(D.contexts);
    for (i = 0; i < opts.length; i++) {
      h += '<button type="button" class="chip' + (f === opts[i].id ? " on" : "") + '" data-action="guide-filter" data-f="' + opts[i].id + '">' + esc(opts[i].short) + "</button>";
    }
    h += '</div><div class="grid2">';
    for (i = 0; i < D.flyTypes.length; i++) {
      var t = D.flyTypes[i];
      if (f !== "all" && t.waters.indexOf(f) < 0) { continue; }
      h += '<details class="card guide-card"><summary><div class="card-row">' + A.flyImg(t.id, "guide-img") + '<div class="card-body"><h3>' + esc(t.name) + "</h3>" +
        '<p class="small muted" style="margin:0">' + esc(t.blurb) + '</p></div><div class="chev">&#8964;</div></div></summary>';
      h += '<p class="small"><b>Common ways to split them:</b></p><p>';
      for (var j = 0; j < t.subs.length; j++) { h += '<span class="pill">' + esc(t.subs[j]) + "</span>"; }
      h += '</p><p class="small"><b>Common patterns:</b> ' + esc(t.examples.join(", ")) + "</p>";
      h += '<p class="small" style="margin:0"><b>Storage tip:</b> ' + esc(t.tip) + "</p></details>";
    }
    h += "</div>";
    h += '<div class="card accent"><h3>Category, food and water are different things</h3><p style="margin:0">A fly\'s <b>category</b> is its form: dry, nymph, streamer. <b>What it imitates</b> and <b>where you fish it</b> are separate. A baitfish streamer can be a trout fly or a saltwater fly, and a jig-hook Pheasant Tail is still a Pheasant Tail. Pick one way to group, and record the rest as details.</p></div>';
    return h;
  }
  A.actions["guide-filter"] = function (el) { guideFilter = el.getAttribute("data-f"); A.rerender(); };

  /* ======================= ROUTES ======================= */
  A.routes.learn = { tab: "learn", render: viewLearn };
  A.routes.approach = { tab: "learn", render: viewApproach };
  A.routes.quiz = { tab: "learn", render: viewQuiz };
  A.routes.finder = { tab: "learn", render: viewFinder };
  A.routes.style = { tab: "learn", render: viewStyle };
  A.routes.guide = { tab: "guide", render: viewGuide };
})();
