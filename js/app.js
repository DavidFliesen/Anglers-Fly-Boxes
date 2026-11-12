/* Angler's Fly Boxes - app logic (ES5 only) */
(function () {
  "use strict";

  var D = window.AFB_DATA;
  var KEY = "afb_state_v1";
  var viewEl = document.getElementById("view");
  var sheetEl = document.getElementById("sheet");
  var sheetPanel = document.getElementById("sheetPanel");
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  var sheetCtx = {};

  /* ======================= STATE ======================= */
  function blankState() {
    return { v: 1, boxes: [], trips: [], kits: {}, quiz: { step: 0, answers: {} }, finder: { step: 0, answers: {} } };
  }
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { s = null; }
    if (!s || typeof s !== "object") { s = blankState(); }
    if (!s.boxes) { s.boxes = []; }
    if (!s.trips) { s.trips = []; }
    if (!s.kits) { s.kits = {}; }
    if (!s.quiz) { s.quiz = { step: 0, answers: {} }; }
    if (!s.finder) { s.finder = { step: 0, answers: {} }; }
    return s;
  }
  var state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast("Could not save on this device"); }
  }

  /* ======================= HELPERS ======================= */
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function uid() { return "x" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); }
  function byId(list, id) {
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
    return null;
  }
  function indexById(list, id) {
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return i; } }
    return -1;
  }
  function approach(id) { return byId(D.approaches, id); }
  function boxStyle(id) { return byId(D.boxStyles, id) || byId(D.accessories, id); }
  function shopUrl(r, st) {
    var u = r.url.replace("{q}", encodeURIComponent(st.q).replace(/%20/g, "+"));
    if (r.params) { u += (u.indexOf("?") >= 0 ? "&" : "?") + r.params.replace(/^[?&]/, ""); }
    if (r.wrap) { u = r.wrap.replace("{url}", encodeURIComponent(u)); }
    return u;
  }
  function styleChip(st) {
    return '<a class="pill teal" style="text-decoration:none" href="#style/' + st.id + '">' + st.icon + " " + esc(st.name) + "</a>";
  }
  function styleCard(st, extra) {
    return '<div class="card tap" data-go="#style/' + st.id + '"><div class="card-row"><div class="card-ico">' + st.icon + '</div><div class="card-body"><h3>' + esc(st.name) + "</h3>" +
      '<p class="small muted" style="margin:0">' + esc(st.short) + "</p>" + (extra || "") + '</div><div class="chev">&#8250;</div></div></div>';
  }
  function flyType(id) { return byId(D.flyTypes, id) || { id: "other", name: "Other", color: "#CCCCCC" }; }
  function val(id) { var el = document.getElementById(id); return el ? el.value : ""; }
  function closest(el, attr) {
    while (el && el !== document) {
      if (el.getAttribute && el.getAttribute(attr) !== null) { return el; }
      el = el.parentNode;
    }
    return null;
  }
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.className = "toast";
    if (toastTimer) { clearTimeout(toastTimer); }
    toastTimer = setTimeout(function () { toastEl.className = "toast hidden"; }, 2200);
  }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  /* hook size -> rank (smaller rank = larger fly). "2/0" -> -2, "14" -> 14 */
  function sizeRank(sz) {
    var s = String(sz || "").replace(/[#\s]/g, "");
    if (!s) { return 999; }
    var m = s.match(/^(\d+)\/0$/);
    if (m) { return -parseInt(m[1], 10); }
    var n = parseInt(s, 10);
    return isNaN(n) ? 999 : n;
  }
  function toneRank(t) { var i = D.colorTones.indexOf(t); return i < 0 ? 99 : i; }
  function sortFlies(list) {
    list.sort(function (a, b) {
      var d = sizeRank(a.size) - sizeRank(b.size);
      if (d !== 0) { return d; }
      d = toneRank(a.tone) - toneRank(b.tone);
      if (d !== 0) { return d; }
      return String(a.pattern).toLowerCase() < String(b.pattern).toLowerCase() ? -1 : 1;
    });
  }
  function boxFlies(box) {
    var out = [];
    for (var i = 0; i < box.panels.length; i++) {
      for (var j = 0; j < box.panels[i].flies.length; j++) { out.push(box.panels[i].flies[j]); }
    }
    return out;
  }
  function sizeRange(flies) {
    var best = null, worst = null;
    for (var i = 0; i < flies.length; i++) {
      var r = sizeRank(flies[i].size);
      if (r === 999) { continue; }
      if (best === null || r < sizeRank(best)) { best = flies[i].size; }
      if (worst === null || r > sizeRank(worst)) { worst = flies[i].size; }
    }
    if (best === null) { return ""; }
    if (String(best) === String(worst)) { return "Size " + best; }
    return "Size " + best + "-" + worst;
  }
  function topTypes(flies, max) {
    var counts = {}, keys = [], i;
    for (i = 0; i < flies.length; i++) {
      var t = flies[i].type;
      if (!counts[t]) { counts[t] = 0; keys.push(t); }
      counts[t] += flies[i].qty || 1;
    }
    keys.sort(function (a, b) { return counts[b] - counts[a]; });
    var names = [];
    for (i = 0; i < keys.length && i < max; i++) { names.push(flyType(keys[i]).name); }
    return names;
  }

  /* ======================= SHEET ======================= */
  function openSheet(title, html, ctx) {
    sheetCtx = ctx || {};
    sheetPanel.innerHTML = '<div class="sheet-head"><h2>' + esc(title) + '</h2><button class="close-x" data-action="close-sheet" aria-label="Close">&times;</button></div>' + html;
    sheetEl.className = "sheet";
    sheetPanel.scrollTop = 0;
  }
  function closeSheet() { sheetEl.className = "sheet hidden"; sheetPanel.innerHTML = ""; sheetCtx = {}; }

  /* ======================= COMMON PIECES ======================= */
  function flyboxVisual(name, panels, kind, withFlies, boxId) {
    var h = '<div class="flybox' + (kind === "puck" ? " puck" : "") + '">';
    h += '<div class="flybox-title">' + (kind === "puck" ? "● " : "") + esc(name) + "</div><div class=\"panels\">";
    for (var i = 0; i < panels.length; i++) {
      var p = panels[i];
      var pname = typeof p === "string" ? p : p.name;
      h += '<div class="panel"><div class="panel-name"><span>' + esc(pname) + "</span>";
      if (withFlies) {
        h += '<button data-action="panel-menu" data-box="' + boxId + '" data-panel="' + p.id + '" aria-label="Panel options">&#8943;</button>';
      }
      h += "</div>";
      if (withFlies) {
        if (!p.flies.length) {
          h += '<div class="empty-panel">Empty. Tap + Add fly.</div>';
        }
        for (var j = 0; j < p.flies.length; j++) {
          var f = p.flies[j];
          var ft = flyType(f.type);
          h += '<button class="fly-chip' + ((f.qty || 0) <= 1 ? " low" : "") + '" data-action="edit-fly" data-box="' + boxId + '" data-fly="' + f.id + '">' +
            '<span class="dot" style="background:' + ft.color + '"></span>' +
            (f.size ? '<span class="sz">#' + esc(String(f.size).replace("#", "")) + "</span>" : "") +
            esc(f.pattern) + (f.tone ? '<span class="tone">· ' + esc(f.tone) + "</span>" : "") +
            '<span class="qty">×' + esc(f.qty) + "</span></button>";
        }
      }
      h += "</div>";
    }
    return h + "</div></div>";
  }

  function approachCard(a) {
    return '<div class="card tap" data-go="#approach/' + a.id + '"><div class="card-row">' +
      '<div class="card-ico">' + a.icon + '</div><div class="card-body"><h3>' + esc(a.name) + "</h3>" +
      '<p class="muted small" style="margin:0">' + esc(a.short) + '</p></div><div class="chev">&#8250;</div></div></div>';
  }

  /* create boxes from an approach layout */
  function applyApproach(id) {
    var a = approach(id);
    if (!a || a.group !== "system") { return 0; }
    var made = 0;
    for (var i = 0; i < a.layout.length; i++) {
      var L = a.layout[i];
      var box = { id: uid(), name: L.name, kind: L.kind || "box", approach: a.id, panels: [], created: Date.now() };
      for (var j = 0; j < L.panels.length; j++) { box.panels.push({ id: uid(), name: L.panels[j], flies: [] }); }
      state.boxes.push(box);
      made++;
    }
    save();
    return made;
  }

  /* ======================= VIEW: LEARN ======================= */
  function viewLearn() {
    var h = '<section class="hero"><img src="images/logo-512.png" alt="Angler\'s Fly Boxes logo" class="hero-logo">' +
      "<h1>Organize your flies your way</h1>" +
      "<p>There's no single perfect system. Start from proven approaches, try one, and shape it into a setup that fits how and where <em>you</em> fish.</p>" +
      '<div class="btn-row" style="justify-content:center"><a class="btn" href="#quiz">Find my system</a><a class="btn light" href="#boxes">My Boxes</a></div></section>';

    h += '<div class="card accent"><h3>&#127907; Rule #1: start with the forage</h3>' +
      "<p style=\"margin:0\">Whatever system you choose, the flies you carry should match what the fish eat, where you're fishing, at that time of year. Learn the water and the season first. The fly box follows.</p></div>";

    h += '<div class="card tap" data-go="#finder"><div class="card-row"><div class="card-ico">\uD83D\uDD0D</div><div class="card-body"><h3>Need a new fly box?</h3><p class="small muted" style="margin:0">The Box Finder matches you with the right kind of box: foam, silicone, compartment, waterproof and more.</p></div><div class="chev">&#8250;</div></div></div>';
    h += '<div class="section-label">Organizing systems</div>';
    var i;
    for (i = 0; i < D.approaches.length; i++) { if (D.approaches[i].group === "system") { h += approachCard(D.approaches[i]); } }

    h += '<div class="section-label">Finishing touches – use with any system</div>';
    for (i = 0; i < D.approaches.length; i++) { if (D.approaches[i].group === "finish") { h += approachCard(D.approaches[i]); } }

    h += '<div class="section-label">Good to know</div><div class="card"><ul class="clean">' +
      "<li><b>Guidelines first, then make it yours.</b> Use a system to get started, then adjust it as you learn what you actually use.</li>" +
      "<li><b>More boxes isn't better.</b> Lots of anglers end up with a pile of boxes and spend their time hunting for the right one.</li>" +
      "<li><b>Your system will evolve.</b> What and how you carry will change with new waters and new species.</li>" +
      "<li><b>Fish don't read labels.</b> A fly tied for one water or species can still work somewhere else, so don't be afraid to experiment.</li>" +
      "<li><b>If you like how a fly looks, the fish might too.</b> It's fine to tie or buy a few patterns just to try them.</li>" +
      "</ul></div>";
    h += '<p class="footer-note">Angler\'s Fly Boxes ' + D.version + " · ARTEZIQ</p>";
    return h;
  }

  /* ======================= VIEW: APPROACH ======================= */
  function viewApproach(id) {
    var a = approach(id);
    if (!a) { return viewLearn(); }
    var h = '<a class="back" href="#learn">&#8249; All approaches</a>';
    h += '<div class="card-row"><div class="card-ico">' + a.icon + '</div><div class="card-body"><h1 style="margin-top:2px">' + esc(a.name) + "</h1></div></div>";
    h += '<p><span class="pill ' + (a.group === "system" ? "deep" : "teal") + '">' + (a.group === "system" ? "Organizing system" : "Finishing touch") + "</span></p>";
    h += '<p style="font-size:17px">' + esc(a.short) + "</p><p>" + esc(a.idea) + "</p>";

    h += "<h2>Example layout</h2>";
    for (var i = 0; i < a.layout.length; i++) {
      h += flyboxVisual(a.layout[i].name, a.layout[i].panels, a.layout[i].kind || "box", false);
    }

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
      h += '<h2>Boxes that suit this system</h2><p>';
      for (i = 0; i < a.boxes.length; i++) { var bs = boxStyle(a.boxes[i]); if (bs) { h += styleChip(bs); } }
      h += '</p><p class="small muted">Tap a box style to learn about it and see where to buy one. Not sure? Try the <a href="#finder">Box Finder</a>.</p>';
    }
    if (a.group === "system") {
      h += '<button class="btn block" data-action="apply-approach" data-id="' + a.id + '">Set up these boxes in My Boxes</button>';
      h += '<p class="muted small" style="text-align:center">Creates empty boxes with these panels. You can rename, add or remove anything.</p>';
    } else {
      h += '<a class="btn block" href="#boxes">Go to My Boxes</a>';
    }
    return h;
  }

  /* ======================= VIEW: QUIZ ======================= */
  function scoreQuiz() {
    var scores = {}, why = {}, tips = [], i, k;
    for (i = 0; i < D.approaches.length; i++) {
      if (D.approaches[i].group === "system") { scores[D.approaches[i].id] = 0; why[D.approaches[i].id] = []; }
    }
    for (i = 0; i < D.quiz.length; i++) {
      var q = D.quiz[i];
      var ai = state.quiz.answers[q.id];
      if (ai == null) { continue; }
      var ans = q.a[ai];
      for (k in ans.s) { if (ans.s.hasOwnProperty(k)) { scores[k] += ans.s[k]; } }
      for (k in ans.why) { if (ans.why.hasOwnProperty(k)) { why[k].push(ans.why[k]); } }
      if (ans.tip) { tips.push(ans.tip); }
    }
    var ids = [];
    for (k in scores) { if (scores.hasOwnProperty(k)) { ids.push(k); } }
    ids.sort(function (a, b) { return scores[b] - scores[a]; });
    return { scores: scores, why: why, ids: ids, tips: tips };
  }

  function viewQuiz() {
    var step = state.quiz.step || 0;
    var h = "";
    if (step < D.quiz.length) {
      var q = D.quiz[step];
      var pct = Math.round((step / D.quiz.length) * 100);
      h += "<h1>Find my system</h1><p class=\"muted\">Five quick questions. We'll match you with the organizing approach that fits how you fish.</p>";
      h += '<div class="progress"><div style="width:' + pct + '%"></div></div>';
      h += '<p class="small muted">Question ' + (step + 1) + " of " + D.quiz.length + "</p><h2>" + esc(q.q) + "</h2>";
      for (var i = 0; i < q.a.length; i++) {
        var sel = state.quiz.answers[q.id] === i ? " sel" : "";
        h += '<button class="choice' + sel + '" data-action="quiz-answer" data-q="' + q.id + '" data-i="' + i + '">' + esc(q.a[i].t) + "</button>";
      }
      if (step > 0) { h += '<button class="btn ghost sm" data-action="quiz-back">&#8249; Back</button>'; }
      return h;
    }
    var r = scoreQuiz();
    var max = r.scores[r.ids[0]] || 1;
    var top = approach(r.ids[0]);
    var second = approach(r.ids[1]);
    h += "<h1>Your best fit</h1>";
    h += '<div class="card result-top"><div class="card-row"><div class="card-ico">' + top.icon + '</div><div class="card-body"><h2 style="margin:0 0 4px">' + esc(top.name) + "</h2>" +
      '<p class="muted" style="margin:0">' + esc(top.short) + "</p></div></div>";
    if (r.why[top.id].length) {
      h += '<p style="margin-top:10px"><b>Why:</b> ' + esc(r.why[top.id].join("; ")) + ".</p>";
    }
    h += '<div class="btn-row"><a class="btn" href="#approach/' + top.id + '">How it works</a>' +
      '<button class="btn light" data-action="apply-approach" data-id="' + top.id + '">Set up these boxes</button></div></div>';

    h += '<div class="card"><p class="small muted" style="margin:0 0 4px">Runner-up</p><h3>' + second.icon + " " + esc(second.name) + "</h3>" +
      '<p class="small" style="margin:0 0 8px">' + esc(second.short) + '</p><a class="btn sm ghost" href="#approach/' + second.id + '">Take a look</a></div>';

    h += '<div class="section-label">How all the systems scored</div><div class="card">';
    for (var j = 0; j < r.ids.length; j++) {
      var a = approach(r.ids[j]);
      var w = Math.max(4, Math.round((r.scores[a.id] / max) * 100));
      h += '<div style="margin-bottom:8px"><div class="small"><b>' + esc(a.name) + "</b></div>" +
        '<div class="score-bar"><div style="width:' + w + "%;background:" + (j === 0 ? "#3F7470" : "#ECCB98") + '"></div></div></div>';
    }
    h += "</div>";

    h += '<div class="section-label">Add these to any system</div>';
    h += '<div class="card"><h3>↕️ Size &amp; color order</h3><p class="small" style="margin:0">Largest to smallest, then light to dark. The Sort button in My Boxes does it for you.</p></div>';
    h += '<div class="card"><h3>🏷️ Label your boxes</h3><p class="small" style="margin:0">My Boxes suggests a label for every box, like "Dry Flies – Trout – Size 12-20".</p></div>';
    if (r.tips.indexOf("restock") >= 0) {
      h += '<div class="card warn"><h3>🔁 Restock after every trip</h3><p class="small" style="margin:0">Keep counts in My Boxes. Any fly down to 1 or fewer shows up on your restock list.</p></div>';
    }
    h += '<button class="btn ghost block" data-action="quiz-reset">Retake the quiz</button>';
    return h;
  }

  /* ======================= VIEW: BOXES ======================= */
  function lowFlies() {
    var out = [];
    for (var i = 0; i < state.boxes.length; i++) {
      var fl = boxFlies(state.boxes[i]);
      for (var j = 0; j < fl.length; j++) { if ((fl[j].qty || 0) <= 1) { out.push({ box: state.boxes[i], fly: fl[j] }); } }
    }
    return out;
  }

  function viewBoxes() {
    var h = "<h1>My Boxes</h1>";
    h += '<div class="btn-row"><button class="btn" data-action="new-box" data-kind="box">+ New box</button><button class="btn light" data-action="new-box" data-kind="puck">+ New puck</button><a class="btn ghost" href="#finder">\uD83D\uDD0D Box Finder</a></div>';
    if (!state.boxes.length) {
      h += '<div class="card accent"><h3>No boxes yet</h3><p>Pick an approach on the Learn tab and tap <b>Set up these boxes</b>, take the quiz, or start a blank box.</p>' +
        '<div class="btn-row"><a class="btn sm" href="#learn">Browse approaches</a><a class="btn sm light" href="#quiz">Take the quiz</a></div></div>';
      h += backupCard();
      return h;
    }
    var low = lowFlies();
    if (low.length) {
      h += '<div class="card warn tap" data-action="show-restock"><div class="card-row"><div class="card-ico" style="background:#EE8A6A">🔁</div><div class="card-body"><h3>Restock list</h3><p class="small" style="margin:0">' +
        plural(low.length, "fly") + " down to 1 or none</p></div><div class=\"chev\">&#8250;</div></div></div>";
    }
    var groups = [["box", "Boxes"], ["puck", "Trip pucks"]];
    for (var g = 0; g < groups.length; g++) {
      var list = [];
      for (var i = 0; i < state.boxes.length; i++) { if (state.boxes[i].kind === groups[g][0]) { list.push(state.boxes[i]); } }
      if (!list.length) { continue; }
      h += '<div class="section-label">' + groups[g][1] + "</div><div class=\"grid2\">";
      for (i = 0; i < list.length; i++) {
        var b = list[i], fl = boxFlies(b), a = approach(b.approach), count = 0;
        for (var c = 0; c < fl.length; c++) { count += parseInt(fl[c].qty, 10) || 0; }
        h += '<div class="card tap" data-go="#box/' + b.id + '"><div class="card-row"><div class="card-ico" style="background:' + (b.kind === "puck" ? "#AFE0D2" : "#ECCB98") + '">' + (b.kind === "puck" ? "●" : "📦") + '</div><div class="card-body"><h3>' + esc(b.name) + "</h3>" +
          (a ? '<span class="pill teal">' + esc(a.name) + "</span>" : "") +
          '<div><span class="stat"><b>' + b.panels.length + "</b> panels</span><span class=\"stat\"><b>" + count + "</b> flies</span></div></div><div class=\"chev\">&#8250;</div></div></div>";
      }
      h += "</div>";
    }
    h += backupCard();
    return h;
  }

  function backupCard() {
    return '<div class="section-label">Backup</div><div class="card"><p class="small">Your boxes are saved on this device. Export a backup file to keep them safe or move them to another device.</p>' +
      '<div class="btn-row"><button class="btn sm sand" data-action="export">Export backup</button><button class="btn sm ghost" data-action="import">Import backup</button></div>' +
      '<input type="file" id="importFile" accept="application/json,.json" class="hidden"></div>';
  }

  /* ======================= VIEW: BOX ======================= */
  function viewBox(id) {
    var b = byId(state.boxes, id);
    if (!b) { return viewBoxes(); }
    var a = approach(b.approach), fl = boxFlies(b), count = 0, low = 0;
    for (var i = 0; i < fl.length; i++) { count += parseInt(fl[i].qty, 10) || 0; if ((fl[i].qty || 0) <= 1) { low++; } }
    var h = '<a class="back" href="#boxes">&#8249; My Boxes</a>';
    h += "<h1>" + esc(b.name) + "</h1><p>" + '<span class="pill ' + (b.kind === "puck" ? "teal" : "") + '">' + (b.kind === "puck" ? "Trip puck" : "Fly box") + "</span>" +
      (a ? '<span class="pill deep">' + esc(a.name) + "</span>" : "") + (b.style && boxStyle(b.style) ? styleChip(boxStyle(b.style)) : "") + "</p>";
    h += '<div><span class="stat"><b>' + b.panels.length + '</b> panels</span><span class="stat"><b>' + fl.length + '</b> patterns</span><span class="stat"><b>' + count + "</b> flies</span>" +
      (low ? '<span class="stat"><b style="color:#C4664E">' + low + "</b> low</span>" : "") + "</div>";
    h += '<div class="btn-row"><button class="btn" data-action="add-fly" data-box="' + b.id + '">+ Add fly</button>' +
      '<button class="btn light" data-action="sort-box" data-box="' + b.id + '">↕ Sort size &amp; color</button>' +
      '<button class="btn sand" data-action="labels" data-box="' + b.id + '">🏷 Labels</button></div>';
    h += flyboxVisual(b.name, b.panels, b.kind, true, b.id);
    h += '<div class="btn-row"><button class="btn sm ghost" data-action="add-panel" data-box="' + b.id + '">+ Add panel</button>' +
      '<button class="btn sm ghost" data-action="edit-box" data-box="' + b.id + '">Rename / settings</button></div>';
    if (a && a.group === "system") {
      h += '<p class="small muted">Organizing with <a href="#approach/' + a.id + '">' + esc(a.name) + "</a>.</p>";
    }
    return h;
  }

  function flyForm(box, fly, panelId) {
    var f = fly || { pattern: "", type: "dry", size: "", tone: "Natural", qty: 3 };
    var i, h = '<label class="f" for="fPattern">Pattern name</label><input type="text" id="fPattern" value="' + esc(f.pattern) + '" placeholder="e.g. Pheasant Tail" autocomplete="off">';
    h += '<label class="f" for="fType">Fly type</label><select id="fType">';
    for (i = 0; i < D.flyTypes.length; i++) {
      h += '<option value="' + D.flyTypes[i].id + '"' + (f.type === D.flyTypes[i].id ? " selected" : "") + ">" + esc(D.flyTypes[i].name) + "</option>";
    }
    h += "</select>";
    h += '<div class="row2"><div><label class="f" for="fSize">Hook size</label><input type="text" id="fSize" value="' + esc(f.size) + '" placeholder="e.g. 14 or 2/0" inputmode="text"></div>' +
      '<div><label class="f" for="fQty">How many</label><input type="number" id="fQty" min="0" value="' + esc(f.qty) + '" inputmode="numeric"></div></div>';
    h += '<label class="f" for="fTone">Color tone</label><select id="fTone">';
    for (i = 0; i < D.colorTones.length; i++) {
      h += "<option" + (f.tone === D.colorTones[i] ? " selected" : "") + ">" + D.colorTones[i] + "</option>";
    }
    h += "</select>";
    h += '<label class="f" for="fPanel">Panel</label><select id="fPanel">';
    for (i = 0; i < box.panels.length; i++) {
      h += '<option value="' + box.panels[i].id + '"' + (box.panels[i].id === panelId ? " selected" : "") + ">" + esc(box.panels[i].name) + "</option>";
    }
    h += "</select>";
    h += '<button class="btn block" data-action="save-fly">' + (fly ? "Save changes" : "Add to box") + "</button>";
    if (fly) { h += '<button class="btn block danger" data-action="delete-fly">Remove this fly</button>'; }
    return h;
  }

  function styleSelect(cur) {
    var h = '<label class="f" for="bStyle">Physical box style</label><select id="bStyle"><option value="">Not set</option>';
    for (var i = 0; i < D.boxStyles.length; i++) {
      h += '<option value="' + D.boxStyles[i].id + '"' + (cur === D.boxStyles[i].id ? " selected" : "") + ">" + esc(D.boxStyles[i].name) + "</option>";
    }
    return h + "</select>";
  }

  function findFly(box, flyId) {
    for (var i = 0; i < box.panels.length; i++) {
      var j = indexById(box.panels[i].flies, flyId);
      if (j >= 0) { return { panel: box.panels[i], index: j, fly: box.panels[i].flies[j] }; }
    }
    return null;
  }

  function labelsSheet(box) {
    var fl = boxFlies(box);
    var types = topTypes(fl, 2);
    var main = (types.length ? types.join(" & ") : (box.kind === "puck" ? "Trip Puck" : "Flies")) + " – " + box.name;
    var sr = sizeRange(fl);
    if (sr) { main += " – " + sr; }
    var h = '<p class="small muted">Write these on waterproof labels or with a paint pen. Tap a label to copy it.</p>';
    h += '<div class="section-label">Lid label</div><div class="label-tag" data-action="copy" data-text="' + esc(main) + '">' + esc(main) + "</div>";
    h += '<div class="section-label">Panel labels</div>';
    for (var i = 0; i < box.panels.length; i++) {
      var p = box.panels[i], t = p.name, r = sizeRange(p.flies);
      if (r) { t += " – " + r; }
      h += '<div class="label-tag" data-action="copy" data-text="' + esc(t) + '">' + esc(t) + "</div>";
    }
    return h;
  }

  /* ======================= VIEW: TRIPS ======================= */
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function seasonFor(m) {
    for (var i = 0; i < D.seasons.length; i++) { if (D.seasons[i].months.indexOf(m) >= 0) { return D.seasons[i]; } }
    return D.seasons[0];
  }

  function viewTrips() {
    var h = "<h1>Trips</h1><p class=\"muted\">Plan the flies for a specific water and month, then build a trip puck from your boxes.</p>";
    h += '<button class="btn" data-action="new-trip">+ Plan a trip</button>';
    if (state.trips.length) {
      h += '<div class="section-label">Your trips</div>';
      for (var i = state.trips.length - 1; i >= 0; i--) {
        var t = state.trips[i], done = 0, k;
        for (k in t.checks) { if (t.checks.hasOwnProperty(k) && t.checks[k]) { done++; } }
        h += '<div class="card tap" data-go="#trip/' + t.id + '"><div class="card-row"><div class="card-ico">🏞️</div><div class="card-body"><h3>' + esc(t.name) + "</h3>" +
          '<p class="small muted" style="margin:0">' + esc([t.water, t.species, MONTHS[t.month]].filter(function (x) { return !!x; }).join(" · ")) + "</p>" +
          '<p class="small" style="margin:4px 0 0">' + done + " of " + D.tripChecklist.length + " prep steps done</p></div><div class=\"chev\">&#8250;</div></div></div>";
      }
    }
    var m = new Date().getMonth(), s = seasonFor(m);
    h += '<div class="section-label">This season: ' + s.name + '</div><div class="card accent"><ul class="clean">';
    for (var j = 0; j < s.hints.length; j++) { h += "<li>" + esc(s.hints[j]) + "</li>"; }
    h += '</ul><p class="small muted" style="margin:0">General guide only. A local hatch chart is always better.</p></div>';

    h += '<div class="section-label">Ready-to-go kits</div>';
    for (var x = 0; x < D.kits.length; x++) {
      var kit = D.kits[x], ks = state.kits[kit.id] || {}, kd = 0;
      for (var n = 0; n < kit.items.length; n++) { if (ks[n]) { kd++; } }
      h += '<details class="card"><summary><div class="card-row"><div class="card-ico">🎒</div><div class="card-body"><h3>' + esc(kit.name) + "</h3>" +
        '<p class="small muted" style="margin:0">' + esc(kit.note) + ' · <span id="kitcount-' + kit.id + '">' + kd + "/" + kit.items.length + ' packed</span></p></div><div class="chev">&#8964;</div></div></summary>';
      for (n = 0; n < kit.items.length; n++) {
        h += '<label class="check' + (ks[n] ? " done" : "") + '"><input type="checkbox" data-action="kit-check" data-kit="' + kit.id + '" data-i="' + n + '"' + (ks[n] ? " checked" : "") + "><span>" + esc(kit.items[n]) + "</span></label>";
      }
      h += '<button class="btn sm ghost" data-action="kit-reset" data-kit="' + kit.id + '">Unpack all</button></details>';
    }
    return h;
  }

  function tripForm(t) {
    t = t || { name: "", water: "", species: "", month: new Date().getMonth() };
    var h = '<label class="f" for="tName">Trip name</label><input type="text" id="tName" value="' + esc(t.name) + '" placeholder="e.g. Saturday on the creek">';
    h += '<label class="f" for="tWater">Water</label><input type="text" id="tWater" value="' + esc(t.water) + '" placeholder="River, lake, beach or pond">';
    h += '<label class="f" for="tSpecies">Target fish</label><input type="text" id="tSpecies" value="' + esc(t.species) + '" placeholder="e.g. Brown trout, redfish, bluegill">';
    h += '<label class="f" for="tMonth">Month</label><select id="tMonth">';
    for (var i = 0; i < 12; i++) { h += '<option value="' + i + '"' + (t.month === i ? " selected" : "") + ">" + MONTHS[i] + "</option>"; }
    h += "</select>";
    h += '<button class="btn block" data-action="save-trip">' + (t.id ? "Save changes" : "Create trip") + "</button>";
    if (t.id) { h += '<button class="btn block danger" data-action="delete-trip">Delete trip</button>'; }
    return h;
  }

  function viewTrip(id) {
    var t = byId(state.trips, id);
    if (!t) { return viewTrips(); }
    var s = seasonFor(t.month);
    var h = '<a class="back" href="#trips">&#8249; Trips</a><h1>' + esc(t.name) + "</h1>";
    h += "<p>" + (t.water ? '<span class="pill teal">' + esc(t.water) + "</span>" : "") + (t.species ? '<span class="pill">' + esc(t.species) + "</span>" : "") +
      '<span class="pill deep">' + MONTHS[t.month] + "</span></p>";
    h += '<button class="btn sm ghost" data-action="edit-trip" data-id="' + t.id + '">Edit trip</button>';

    h += "<h2>" + s.name + ' starting points</h2><div class="card accent"><ul class="clean">';
    for (var i = 0; i < s.hints.length; i++) { h += "<li>" + esc(s.hints[i]) + "</li>"; }
    h += "</ul></div>";

    h += '<h2>Forage notes</h2><p class="small muted">What did the hatch chart, a fly shop or your own eyes say the fish are eating?</p>' +
      '<textarea id="tripNotes" data-action="trip-notes" data-id="' + t.id + '" placeholder="e.g. Tan caddis #14-16 in the evening, small black stoneflies, hoppers along the grassy banks">' + esc(t.notes || "") + "</textarea>";

    h += '<h2>Prep checklist</h2><div class="card">';
    for (i = 0; i < D.tripChecklist.length; i++) {
      var on = t.checks && t.checks[i];
      h += '<label class="check' + (on ? " done" : "") + '"><input type="checkbox" data-action="trip-check" data-id="' + t.id + '" data-i="' + i + '"' + (on ? " checked" : "") + "><span>" + esc(D.tripChecklist[i]) + "</span></label>";
    }
    h += "</div>";

    h += '<h2>Trip puck</h2>';
    var puck = t.puckId ? byId(state.boxes, t.puckId) : null;
    if (puck) {
      h += flyboxVisual(puck.name, puck.panels, "puck", true, puck.id);
      h += '<div class="btn-row"><a class="btn sm" href="#box/' + puck.id + '">Open puck</a><button class="btn sm light" data-action="build-puck" data-id="' + t.id + '">Add more flies</button></div>';
    } else {
      h += '<div class="card"><p>Pick just the patterns you expect to use on this water and they\'ll go into a small puck. Your big boxes stay in the pack as backup.</p>' +
        '<button class="btn" data-action="build-puck" data-id="' + t.id + '">Build a trip puck</button></div>';
    }
    return h;
  }

  function puckPicker(trip) {
    var h = '<p class="small muted">Choose flies from your boxes. They\'re copied into the puck with up to 3 of each. Adjust the counts later.</p>';
    var any = false;
    for (var i = 0; i < state.boxes.length; i++) {
      var b = state.boxes[i];
      if (b.id === trip.puckId) { continue; }
      var fl = boxFlies(b);
      if (!fl.length) { continue; }
      any = true;
      h += '<div class="section-label">' + esc(b.name) + '</div><div class="card" style="padding:6px 12px">';
      for (var j = 0; j < fl.length; j++) {
        var f = fl[j];
        h += '<label class="check"><input type="checkbox" class="pick" value="' + b.id + "|" + f.id + '"><span><span class="type-swatch" style="background:' + flyType(f.type).color + '"></span>' +
          (f.size ? "#" + esc(f.size) + " " : "") + esc(f.pattern) + ' <span class="muted small">(' + esc(flyType(f.type).name) + ")</span></span></label>";
      }
      h += "</div>";
    }
    if (!any) {
      return '<div class="card warn"><p>You don\'t have any flies in your boxes yet. Add some in <b>My Boxes</b> first, or create an empty puck and fill it as you go.</p></div>' +
        '<button class="btn block" data-action="make-puck" data-empty="1">Create an empty puck</button>';
    }
    return h + '<button class="btn block" data-action="make-puck">Put selected flies in the puck</button>';
  }

  /* ======================= VIEW: GUIDE ======================= */
  function viewGuide() {
    var h = "<h1>Fly Guide</h1><p class=\"muted\">The main families of flies, how to split them up, and a storage tip for each. Each color matches the fly dots in My Boxes.</p>";
    for (var i = 0; i < D.flyTypes.length; i++) {
      var t = D.flyTypes[i];
      h += '<details class="card"><summary><div class="card-row"><div class="card-ico" style="background:' + t.color + '"></div><div class="card-body"><h3>' + esc(t.name) + "</h3>" +
        '<p class="small muted" style="margin:0">' + esc(t.blurb) + '</p></div><div class="chev">&#8964;</div></div></summary>';
      h += '<p class="small"><b>Split them up by:</b></p><p>';
      for (var j = 0; j < t.subs.length; j++) { h += '<span class="pill teal">' + esc(t.subs[j]) + "</span>"; }
      h += '</p><p class="small"><b>Common patterns:</b> ' + esc(t.examples.join(", ")) + "</p>";
      h += '<p class="small" style="margin:0"><b>Storage tip:</b> ' + esc(t.tip) + "</p></details>";
    }
    h += '<div class="card accent"><h3>↕️ Inside every row</h3><p style="margin:0">Arrange by size, largest to smallest, then by color from light to dark (or natural to flashy). Matching water clarity and light gets a lot faster.</p></div>';
    return h;
  }

  /* ======================= VIEW: BOX FINDER ======================= */
  function scoreFinder() {
    var scores = {}, i, k;
    for (i = 0; i < D.boxStyles.length; i++) { scores[D.boxStyles[i].id] = 0; }
    for (i = 0; i < D.boxFinder.length; i++) {
      var ai = state.finder.answers[D.boxFinder[i].id];
      if (ai == null) { continue; }
      var sc = D.boxFinder[i].a[ai].s;
      for (k in sc) { if (sc.hasOwnProperty(k)) { scores[k] += sc[k]; } }
    }
    var ids = [];
    for (k in scores) { if (scores.hasOwnProperty(k)) { ids.push(k); } }
    ids.sort(function (a, b) { return scores[b] - scores[a]; });
    return { scores: scores, ids: ids };
  }

  function viewFinder() {
    var F = D.boxFinder, step = state.finder.step || 0, h = "<h1>Box Finder</h1>", i;
    if (step < F.length) {
      var q = F[step];
      h += '<p class="muted">Five quick questions and we\'ll suggest the kind of fly box that fits how you fish.</p>';
      h += '<div class="progress"><div style="width:' + Math.round((step / F.length) * 100) + '%"></div></div>';
      h += '<p class="small muted">Question ' + (step + 1) + " of " + F.length + "</p><h2>" + esc(q.q) + "</h2>";
      for (i = 0; i < q.a.length; i++) {
        h += '<button class="choice' + (state.finder.answers[q.id] === i ? " sel" : "") + '" data-action="finder-answer" data-q="' + q.id + '" data-i="' + i + '">' + esc(q.a[i].t) + "</button>";
      }
      if (step > 0) { h += '<button class="btn ghost sm" data-action="finder-back">&#8249; Back</button>'; }
    } else {
      var r = scoreFinder(), top = boxStyle(r.ids[0]), second = boxStyle(r.ids[1]), said = [];
      for (i = 0; i < F.length; i++) { var ai = state.finder.answers[F[i].id]; if (ai != null) { said.push(F[i].a[ai].t); } }
      h += '<p class="small muted">You said: ' + esc(said.join(" \u00B7 ")) + "</p>";
      h += '<div class="card result-top"><p class="small muted" style="margin:0 0 6px">Your best match</p><div class="card-row"><div class="card-ico">' + top.icon + '</div><div class="card-body"><h2 style="margin:0 0 4px">' + esc(top.name) + "</h2>" +
        '<p style="margin:0">' + esc(top.short) + '</p><p class="small" style="margin:6px 0 0"><b>Holds:</b> ' + esc(top.holds) + "</p></div></div>" +
        '<div class="btn-row"><button class="btn" data-action="shop" data-style="' + top.id + '">\uD83D\uDED2 Shop this style</button><a class="btn light" href="#style/' + top.id + '">Learn more</a></div></div>';
      h += '<div class="section-label">Also a good fit</div>' + styleCard(second, '<button class="btn sm sand" style="margin-top:8px" data-action="shop" data-style="' + second.id + '">\uD83D\uDED2 Shop</button>');
      var wet = state.finder.answers.wet;
      if (wet != null && wet > 0 && D.accessories.length) {
        var acc = D.accessories[0];
        h += '<div class="section-label">Pair it with</div><div class="card"><h3>' + acc.icon + " " + esc(acc.name) + '</h3><p class="small">' + esc(acc.short) + '</p><button class="btn sm sand" data-action="shop" data-style="' + acc.id + '">\uD83D\uDED2 Shop</button></div>';
      }
      h += '<button class="btn ghost block" data-action="finder-reset">Start over</button>';
    }
    h += '<div class="section-label">All box styles</div>';
    for (i = 0; i < D.boxStyles.length; i++) { h += styleCard(D.boxStyles[i]); }
    h += '<p class="footer-note">' + esc(D.shop.disclosure) + "</p>";
    return h;
  }

  function viewStyle(id) {
    var st = boxStyle(id);
    if (!st) { return viewFinder(); }
    var h = '<a class="back" href="#finder">&#8249; Box Finder</a>';
    h += '<div class="card-row"><div class="card-ico">' + st.icon + '</div><div class="card-body"><h1 style="margin-top:2px">' + esc(st.name) + "</h1></div></div>";
    h += '<p style="font-size:17px">' + esc(st.short) + "</p>";
    if (st.holds) { h += '<div class="card accent"><h3>Best for holding</h3><p style="margin:0">' + esc(st.holds) + "</p></div>"; }
    var i;
    if (st.pros) {
      h += '<div class="two-col"><div><h2>Pros</h2><div class="card"><ul class="clean pros">';
      for (i = 0; i < st.pros.length; i++) { h += "<li>" + esc(st.pros[i]) + "</li>"; }
      h += '</ul></div></div><div><h2>Watch-outs</h2><div class="card"><ul class="clean cons">';
      for (i = 0; i < st.cons.length; i++) { h += "<li>" + esc(st.cons[i]) + "</li>"; }
      h += "</ul></div></div></div>";
    }
    if (st.tip) { h += '<div class="card"><h3>\uD83D\uDCA1 Tip</h3><p style="margin:0">' + esc(st.tip) + "</p></div>"; }
    var fits = [];
    for (i = 0; i < D.approaches.length; i++) { if (D.approaches[i].boxes && D.approaches[i].boxes.indexOf(st.id) >= 0) { fits.push(D.approaches[i]); } }
    if (fits.length) {
      h += "<h2>Works well with</h2><p>";
      for (i = 0; i < fits.length; i++) { h += '<a class="pill deep" style="text-decoration:none" href="#approach/' + fits[i].id + '">' + esc(fits[i].name) + "</a>"; }
      h += "</p>";
    }
    h += '<button class="btn block" data-action="shop" data-style="' + st.id + '">\uD83D\uDED2 Where to buy</button>';
    return h;
  }

  function shopSheet(st) {
    var h = '<p>Shopping for a <b>' + esc(st.name) + "</b>. Pick a store:</p>";
    for (var i = 0; i < D.shop.retailers.length; i++) {
      var r = D.shop.retailers[i];
      h += '<a class="choice" style="text-decoration:none" href="' + esc(shopUrl(r, st)) + '" target="_blank" rel="sponsored noopener">' +
        "<b>" + esc(r.name) + ' &#8599;</b><br><span class="small muted">' + esc(r.note) + "</span></a>";
    }
    h += '<p class="small muted">Look for: ' + esc(st.q) + '.</p><p class="footer-note">' + esc(D.shop.disclosure) + "</p>";
    return h;
  }

  /* ======================= ABOUT ======================= */
  function aboutSheet() {
    var h = '<div style="text-align:center"><img src="images/logo-512.png" alt="" style="width:130px;height:130px"></div>';
    h += '<p style="text-align:center"><b>Angler\'s Fly Boxes</b> ' + D.version + '<br><span class="small muted">An ARTEZIQ app</span></p>';
    h += "<p>Learn several ways to organize your flies, find the one that fits how you fish, and keep track of your boxes, pucks and trips.</p>";
    h += '<div class="card"><h3>Install it</h3><p class="small" style="margin:0">On iPhone or iPad, tap <b>Share</b> then <b>Add to Home Screen</b>. It opens full screen and works offline.</p></div>';
    h += backupCard();
    h += '<div class="section-label">Danger zone</div><button class="btn block danger" data-action="reset-all">Erase all my boxes and trips</button>';
    h += '<p class="footer-note">Guidance gathered from the fly fishing community. Your data stays on this device.</p>';
    h += '<p class="footer-note">' + esc(D.shop.disclosure) + "</p>";
    return h;
  }

  /* ======================= ROUTER ======================= */
  function route() {
    var hash = (location.hash || "#learn").replace(/^#/, "");
    var parts = hash.split("/");
    var tab = parts[0], html;
    switch (tab) {
      case "approach": html = viewApproach(parts[1]); tab = "learn"; break;
      case "quiz": html = viewQuiz(); break;
      case "boxes": html = viewBoxes(); break;
      case "box": html = viewBox(parts[1]); tab = "boxes"; break;
      case "finder": html = viewFinder(); break;
      case "style": html = viewStyle(parts[1]); tab = "finder"; break;
      case "trips": html = viewTrips(); break;
      case "trip": html = viewTrip(parts[1]); tab = "trips"; break;
      case "guide": html = viewGuide(); break;
      default: html = viewLearn(); tab = "learn";
    }
    viewEl.innerHTML = html;
    var links = document.querySelectorAll(".tabbar a");
    for (var i = 0; i < links.length; i++) {
      links[i].className = links[i].getAttribute("data-tab") === tab ? "active" : "";
    }
  }
  function rerender() {
    var y = window.pageYOffset;
    route();
    window.scrollTo(0, y);
  }
  function go(hash) {
    if (location.hash === hash) { route(); } else { location.hash = hash; }
    window.scrollTo(0, 0);
  }

  /* ======================= ACTIONS ======================= */
  function doExport() {
    var data = JSON.stringify({ app: "anglers-fly-boxes", exported: new Date().toISOString(), state: state }, null, 2);
    var blob = new Blob([data], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "anglers-fly-boxes-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 1000);
    toast("Backup file saved");
  }
  function doImport(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var obj = JSON.parse(r.result);
        var s = obj && obj.state ? obj.state : obj;
        if (!s || !s.boxes || !(s.boxes instanceof Array)) { throw new Error("bad"); }
        if (!confirm("Replace your current boxes and trips with this backup?")) { return; }
        state = s;
        if (!state.trips) { state.trips = []; }
        if (!state.kits) { state.kits = {}; }
        if (!state.quiz) { state.quiz = { step: 0, answers: {} }; }
        if (!state.finder) { state.finder = { step: 0, answers: {} }; }
        save(); closeSheet(); rerender(); toast("Backup restored");
      } catch (e) { toast("That file isn't an Angler's Fly Boxes backup"); }
    };
    r.readAsText(file);
  }
  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(function () { toast("Copied"); }, function () { window.prompt("Copy this label:", t); });
    } else { window.prompt("Copy this label:", t); }
  }

  var actions = {
    "close-sheet": function () { closeSheet(); },
    "finder-answer": function (el) {
      state.finder.answers[el.getAttribute("data-q")] = parseInt(el.getAttribute("data-i"), 10);
      state.finder.step = (state.finder.step || 0) + 1;
      save(); route(); window.scrollTo(0, 0);
    },
    "finder-back": function () { state.finder.step = Math.max(0, (state.finder.step || 0) - 1); save(); route(); },
    "finder-reset": function () { state.finder = { step: 0, answers: {} }; save(); route(); window.scrollTo(0, 0); },
    "shop": function (el) {
      var st = boxStyle(el.getAttribute("data-style"));
      if (st) { openSheet("Where to buy", shopSheet(st)); }
    },
    "apply-approach": function (el) {
      var n = applyApproach(el.getAttribute("data-id"));
      toast(plural(n, "box") + " added to My Boxes");
      go("#boxes");
    },
    "quiz-answer": function (el) {
      state.quiz.answers[el.getAttribute("data-q")] = parseInt(el.getAttribute("data-i"), 10);
      state.quiz.step = (state.quiz.step || 0) + 1;
      save(); route(); window.scrollTo(0, 0);
    },
    "quiz-back": function () { state.quiz.step = Math.max(0, (state.quiz.step || 0) - 1); save(); route(); },
    "quiz-reset": function () { state.quiz = { step: 0, answers: {} }; save(); route(); window.scrollTo(0, 0); },

    "new-box": function (el) {
      var kind = el.getAttribute("data-kind");
      var h = '<label class="f" for="bName">Name</label><input type="text" id="bName" placeholder="' + (kind === "puck" ? "e.g. Small creek puck" : "e.g. Trout Stream Box") + '">';
      h += '<label class="f" for="bApproach">Organizing approach</label><select id="bApproach"><option value="">None / my own</option>';
      for (var i = 0; i < D.approaches.length; i++) {
        if (D.approaches[i].group === "system") { h += '<option value="' + D.approaches[i].id + '">' + esc(D.approaches[i].name) + "</option>"; }
      }
      h += "</select>" + styleSelect(kind === "puck" ? "puck" : "") + '<label class="f" for="bPanels">Panels (one per line)</label><textarea id="bPanels">' + (kind === "puck" ? "Trip flies" : "Nymphs\nDries\nStreamers\nMisc") + "</textarea>";
      h += '<button class="btn block" data-action="create-box">Create ' + (kind === "puck" ? "puck" : "box") + "</button>";
      openSheet(kind === "puck" ? "New trip puck" : "New fly box", h, { kind: kind });
    },
    "create-box": function () {
      var name = val("bName").replace(/^\s+|\s+$/g, "");
      if (!name) { toast("Give it a name"); return; }
      var lines = val("bPanels").split(/\n/), panels = [];
      for (var i = 0; i < lines.length; i++) {
        var p = lines[i].replace(/^\s+|\s+$/g, "");
        if (p) { panels.push({ id: uid(), name: p, flies: [] }); }
      }
      if (!panels.length) { panels.push({ id: uid(), name: "Panel 1", flies: [] }); }
      var b = { id: uid(), name: name, kind: sheetCtx.kind || "box", approach: val("bApproach"), style: val("bStyle"), panels: panels, created: Date.now() };
      state.boxes.push(b); save(); closeSheet(); go("#box/" + b.id);
    },
    "edit-box": function (el) {
      var b = byId(state.boxes, el.getAttribute("data-box"));
      var h = '<label class="f" for="bName">Name</label><input type="text" id="bName" value="' + esc(b.name) + '">';
      h += '<label class="f" for="bKind">Kind</label><select id="bKind"><option value="box"' + (b.kind === "box" ? " selected" : "") + '>Fly box</option><option value="puck"' + (b.kind === "puck" ? " selected" : "") + ">Trip puck</option></select>";
      h += '<label class="f" for="bApproach">Organizing approach</label><select id="bApproach"><option value="">None / my own</option>';
      for (var i = 0; i < D.approaches.length; i++) {
        if (D.approaches[i].group === "system") { h += '<option value="' + D.approaches[i].id + '"' + (b.approach === D.approaches[i].id ? " selected" : "") + ">" + esc(D.approaches[i].name) + "</option>"; }
      }
      h += "</select>" + styleSelect(b.style || "");
      h += '<button class="btn block" data-action="save-box">Save</button><button class="btn block danger" data-action="delete-box">Delete this ' + (b.kind === "puck" ? "puck" : "box") + "</button>";
      openSheet("Box settings", h, { box: b.id });
    },
    "save-box": function () {
      var b = byId(state.boxes, sheetCtx.box);
      var name = val("bName").replace(/^\s+|\s+$/g, "");
      if (name) { b.name = name; }
      b.kind = val("bKind"); b.approach = val("bApproach"); b.style = val("bStyle");
      save(); closeSheet(); rerender(); toast("Saved");
    },
    "delete-box": function () {
      var b = byId(state.boxes, sheetCtx.box);
      if (!confirm('Delete "' + b.name + '" and every fly in it?')) { return; }
      state.boxes.splice(indexById(state.boxes, b.id), 1);
      for (var i = 0; i < state.trips.length; i++) { if (state.trips[i].puckId === b.id) { state.trips[i].puckId = null; } }
      save(); closeSheet(); go("#boxes"); toast("Deleted");
    },
    "add-panel": function (el) {
      openSheet("Add a panel", '<label class="f" for="pName">Panel name</label><input type="text" id="pName" placeholder="e.g. Midges">' +
        '<button class="btn block" data-action="save-panel">Add panel</button>', { box: el.getAttribute("data-box") });
    },
    "panel-menu": function (el) {
      var b = byId(state.boxes, el.getAttribute("data-box"));
      var p = byId(b.panels, el.getAttribute("data-panel"));
      var h = '<label class="f" for="pName">Panel name</label><input type="text" id="pName" value="' + esc(p.name) + '">' +
        '<button class="btn block" data-action="save-panel">Save name</button>' +
        '<button class="btn block light" data-action="add-fly-here">+ Add fly to this panel</button>' +
        '<button class="btn block sand" data-action="sort-panel">↕ Sort this panel</button>' +
        '<button class="btn block danger" data-action="delete-panel">Delete panel' + (p.flies.length ? " and its " + plural(p.flies.length, "fly") : "") + "</button>";
      openSheet("Panel", h, { box: b.id, panel: p.id });
    },
    "save-panel": function () {
      var b = byId(state.boxes, sheetCtx.box);
      var name = val("pName").replace(/^\s+|\s+$/g, "");
      if (!name) { toast("Name the panel"); return; }
      if (sheetCtx.panel) { byId(b.panels, sheetCtx.panel).name = name; } else { b.panels.push({ id: uid(), name: name, flies: [] }); }
      save(); closeSheet(); rerender();
    },
    "delete-panel": function () {
      var b = byId(state.boxes, sheetCtx.box);
      if (b.panels.length <= 1) { toast("A box needs at least one panel"); return; }
      if (!confirm("Delete this panel?")) { return; }
      b.panels.splice(indexById(b.panels, sheetCtx.panel), 1);
      save(); closeSheet(); rerender();
    },
    "sort-panel": function () {
      var b = byId(state.boxes, sheetCtx.box);
      sortFlies(byId(b.panels, sheetCtx.panel).flies);
      save(); closeSheet(); rerender(); toast("Sorted large → small, light → dark");
    },
    "add-fly": function (el) {
      var b = byId(state.boxes, el.getAttribute("data-box"));
      openSheet("Add a fly", flyForm(b, null, b.panels[0].id), { box: b.id });
      setTimeout(function () { var i = document.getElementById("fPattern"); if (i) { i.focus(); } }, 50);
    },
    "add-fly-here": function () {
      var b = byId(state.boxes, sheetCtx.box), pid = sheetCtx.panel;
      openSheet("Add a fly", flyForm(b, null, pid), { box: b.id });
    },
    "edit-fly": function (el) {
      var b = byId(state.boxes, el.getAttribute("data-box"));
      var hit = findFly(b, el.getAttribute("data-fly"));
      if (!hit) { return; }
      openSheet("Edit fly", flyForm(b, hit.fly, hit.panel.id), { box: b.id, fly: hit.fly.id });
    },
    "save-fly": function () {
      var b = byId(state.boxes, sheetCtx.box);
      var pattern = val("fPattern").replace(/^\s+|\s+$/g, "");
      if (!pattern) { toast("Enter the pattern name"); return; }
      var qty = parseInt(val("fQty"), 10);
      var data = { pattern: pattern, type: val("fType"), size: val("fSize").replace(/^\s*#?|\s+$/g, ""), tone: val("fTone"), qty: isNaN(qty) ? 0 : Math.max(0, qty) };
      var target = byId(b.panels, val("fPanel")), k;
      if (sheetCtx.fly) {
        var hit = findFly(b, sheetCtx.fly);
        for (k in data) { if (data.hasOwnProperty(k)) { hit.fly[k] = data[k]; } }
        if (hit.panel.id !== target.id) { hit.panel.flies.splice(hit.index, 1); target.flies.push(hit.fly); }
        toast("Saved");
      } else {
        data.id = uid();
        target.flies.push(data);
        toast("Added " + pattern);
      }
      save(); closeSheet(); rerender();
    },
    "delete-fly": function () {
      var b = byId(state.boxes, sheetCtx.box), hit = findFly(b, sheetCtx.fly);
      hit.panel.flies.splice(hit.index, 1);
      save(); closeSheet(); rerender(); toast("Removed");
    },
    "sort-box": function (el) {
      var b = byId(state.boxes, el.getAttribute("data-box"));
      for (var i = 0; i < b.panels.length; i++) { sortFlies(b.panels[i].flies); }
      save(); rerender(); toast("Sorted large → small, light → dark");
    },
    "labels": function (el) {
      var b = byId(state.boxes, el.getAttribute("data-box"));
      openSheet("Label ideas", labelsSheet(b));
    },
    "copy": function (el) { copyText(el.getAttribute("data-text")); },
    "show-restock": function () {
      var low = lowFlies(), h = '<p class="small muted">Flies with 1 or none left. Tie or buy a few before your next trip.</p><div class="card">';
      for (var i = 0; i < low.length; i++) {
        h += '<div class="check" data-action="edit-fly" data-box="' + low[i].box.id + '" data-fly="' + low[i].fly.id + '"><span><span class="type-swatch" style="background:' + flyType(low[i].fly.type).color + '"></span>' +
          (low[i].fly.size ? "#" + esc(low[i].fly.size) + " " : "") + esc(low[i].fly.pattern) + ' <span class="muted small">· ' + esc(low[i].box.name) + " · " + esc(low[i].fly.qty) + " left</span></span></div>";
      }
      openSheet("Restock list", h + "</div>");
    },
    "export": function () { doExport(); },
    "import": function () { var f = document.getElementById("importFile"); if (f) { f.click(); } },
    "reset-all": function () {
      if (!confirm("Erase all boxes, trips and quiz answers on this device?")) { return; }
      state = blankState(); save(); closeSheet(); go("#learn"); toast("All data erased");
    },

    "new-trip": function () { openSheet("Plan a trip", tripForm(null), {}); },
    "edit-trip": function (el) { openSheet("Edit trip", tripForm(byId(state.trips, el.getAttribute("data-id"))), { trip: el.getAttribute("data-id") }); },
    "save-trip": function () {
      var name = val("tName").replace(/^\s+|\s+$/g, "");
      if (!name) { toast("Name your trip"); return; }
      var t = sheetCtx.trip ? byId(state.trips, sheetCtx.trip) : { id: uid(), checks: {}, notes: "", puckId: null };
      t.name = name; t.water = val("tWater"); t.species = val("tSpecies"); t.month = parseInt(val("tMonth"), 10);
      if (!sheetCtx.trip) { state.trips.push(t); }
      save(); closeSheet(); go("#trip/" + t.id);
    },
    "delete-trip": function () {
      if (!confirm("Delete this trip? Its puck stays in My Boxes.")) { return; }
      state.trips.splice(indexById(state.trips, sheetCtx.trip), 1);
      save(); closeSheet(); go("#trips");
    },
    "build-puck": function (el) {
      var t = byId(state.trips, el.getAttribute("data-id"));
      openSheet("Build a trip puck", puckPicker(t), { trip: t.id });
    },
    "make-puck": function () {
      var t = byId(state.trips, sheetCtx.trip);
      var puck = t.puckId ? byId(state.boxes, t.puckId) : null;
      if (!puck) {
        puck = { id: uid(), name: "Puck: " + t.name, kind: "puck", approach: "puck", panels: [], created: Date.now() };
        state.boxes.push(puck); t.puckId = puck.id;
      }
      var picks = document.querySelectorAll("input.pick"), added = 0;
      for (var i = 0; i < picks.length; i++) {
        if (!picks[i].checked) { continue; }
        var bits = picks[i].value.split("|");
        var src = byId(state.boxes, bits[0]);
        var hit = src ? findFly(src, bits[1]) : null;
        if (!hit) { continue; }
        var tname = flyType(hit.fly.type).name, panel = null;
        for (var j = 0; j < puck.panels.length; j++) { if (puck.panels[j].name === tname) { panel = puck.panels[j]; } }
        if (!panel) { panel = { id: uid(), name: tname, flies: [] }; puck.panels.push(panel); }
        panel.flies.push({ id: uid(), pattern: hit.fly.pattern, type: hit.fly.type, size: hit.fly.size, tone: hit.fly.tone, qty: Math.min(3, Math.max(1, parseInt(hit.fly.qty, 10) || 1)) });
        added++;
      }
      if (!puck.panels.length) { puck.panels.push({ id: uid(), name: "Trip flies", flies: [] }); }
      for (j = 0; j < puck.panels.length; j++) { sortFlies(puck.panels[j].flies); }
      if (!t.checks) { t.checks = {}; }
      t.checks[3] = true;
      save(); closeSheet(); rerender();
      toast(added ? plural(added, "pattern") + " added to the puck" : "Empty puck created");
    }
  };

  /* ======================= EVENTS ======================= */
  document.addEventListener("click", function (e) {
    var el = closest(e.target, "data-action");
    if (el && el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
      var fn = actions[el.getAttribute("data-action")];
      if (fn) { e.preventDefault(); fn(el, e); return; }
    }
    var g = closest(e.target, "data-go");
    if (g) { go(g.getAttribute("data-go")); }
  });

  document.addEventListener("change", function (e) {
    var el = e.target, act = el.getAttribute ? el.getAttribute("data-action") : null;
    if (el.id === "importFile" && el.files && el.files[0]) { doImport(el.files[0]); el.value = ""; return; }
    if (act === "kit-check") {
      var kid = el.getAttribute("data-kit");
      if (!state.kits[kid]) { state.kits[kid] = {}; }
      state.kits[kid][el.getAttribute("data-i")] = el.checked;
      save();
      el.parentNode.className = "check" + (el.checked ? " done" : "");
      updateKitCount(kid);
    } else if (act === "trip-check") {
      var t = byId(state.trips, el.getAttribute("data-id"));
      if (!t.checks) { t.checks = {}; }
      t.checks[el.getAttribute("data-i")] = el.checked;
      el.parentNode.className = "check" + (el.checked ? " done" : "");
      save();
    }
  });

  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.getAttribute && el.getAttribute("data-action") === "trip-notes") {
      var t = byId(state.trips, el.getAttribute("data-id"));
      if (t) { t.notes = el.value; save(); }
    }
  });

  function updateKitCount(kid) {
    var kit = byId(D.kits, kid), ks = state.kits[kid] || {}, n = 0, i;
    for (i = 0; i < kit.items.length; i++) { if (ks[i]) { n++; } }
    var el = document.getElementById("kitcount-" + kid);
    if (el) { el.textContent = n + "/" + kit.items.length + " packed"; }
  }
  actions["kit-reset"] = function (el) {
    var kid = el.getAttribute("data-kit");
    state.kits[kid] = {}; save();
    var boxes = document.querySelectorAll('input[data-kit="' + kid + '"]');
    for (var i = 0; i < boxes.length; i++) { boxes[i].checked = false; boxes[i].parentNode.className = "check"; }
    updateKitCount(kid); toast("Kit unpacked");
  };

  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 27 && sheetEl.className.indexOf("hidden") < 0) { closeSheet(); }
  });

  document.getElementById("aboutBtn").addEventListener("click", function () { openSheet("About & settings", aboutSheet()); });
  window.addEventListener("hashchange", function () { route(); window.scrollTo(0, 0); });

  route();

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").then(function () {}, function () {}); });
  }
})();
