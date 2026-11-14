/* Angler's Fly Boxes - core: state, helpers, sheets, router, events, updates (ES5 only)
   Feature modules (boxes.js, learn.js, trips.js) add routes and actions to window.AFB. */
(function () {
  "use strict";

  var D = window.AFB_DATA;
  var KEY = "afb_state_v1";
  var A = window.AFB = { D: D, routes: {}, actions: {}, onChange: {}, onInput: {} };

  /* ======================= STATE ======================= */
  function blankState() {
    return {
      v: 2, boxes: [], trips: [], kits: {},
      quiz: { step: 0, answers: {} }, finder: { step: 0, answers: {} },
      profile: { water: null }, prefs: { view: "box", lastType: "nymph" }
    };
  }
  function migrate(s) {
    var b, p, f, i, j, k;
    if (!s.boxes) { s.boxes = []; }
    if (!s.trips) { s.trips = []; }
    if (!s.kits) { s.kits = {}; }
    if (!s.quiz || !s.quiz.answers) { s.quiz = { step: 0, answers: {} }; }
    if (!s.finder || !s.finder.answers) { s.finder = { step: 0, answers: {} }; }
    if (!s.profile) { s.profile = { water: null }; }
    if (!s.prefs) { s.prefs = { view: "box", lastType: "nymph" }; }
    if ((s.v || 1) < 2) {
      /* v1 -> v2: old quiz answers used indexes; fly types renamed; panels become sections */
      s.quiz = { step: 0, answers: {} };
      s.finder = { step: 0, answers: {} };
      for (i = 0; i < s.boxes.length; i++) {
        b = s.boxes[i];
        for (j = 0; j < b.panels.length; j++) {
          p = b.panels[j];
          for (k = 0; k < p.flies.length; k++) {
            f = p.flies[k];
            if (f.type === "salt") { f.type = "crustacean"; }
            if (f.type === "warm") { f.type = "popper"; }
            f.qty = parseInt(f.qty, 10) || 0;
            f.max = f.qty;
          }
        }
      }
      for (i = 0; i < s.trips.length; i++) {
        var tr = s.trips[i];
        if (tr.water && ["trout", "salt", "warm"].indexOf(tr.water) < 0) { tr.place = tr.water; tr.water = ""; }
      }
      s.v = 2;
    }
    return s;
  }
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { s = null; }
    if (!s || typeof s !== "object") { s = blankState(); }
    return migrate(s);
  }
  A.state = load();
  A.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(A.state)); } catch (e) { A.toast("Couldn't save on this device"); }
  };
  A.replaceState = function (s) { A.state = migrate(s); A.save(); };
  A.resetState = function () { A.state = blankState(); A.save(); };

  /* ======================= HELPERS ======================= */
  A.esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  A.uid = function () { return "x" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); };
  A.byId = function (list, id) {
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
    return null;
  };
  A.indexById = function (list, id) {
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return i; } }
    return -1;
  };
  A.val = function (id) { var el = document.getElementById(id); return el ? el.value : ""; };
  A.trim = function (s) { return String(s || "").replace(/^\s+|\s+$/g, ""); };
  A.count = function (n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); };
  A.approach = function (id) { return A.byId(D.approaches, id); };
  A.flyType = function (id) { return A.byId(D.flyTypes, id) || { id: "other", name: "Other", one: "fly", subs: [], examples: [] }; };
  A.color = function (id) { return A.byId(D.colors, id); };
  A.boxStyle = function (id) { return A.byId(D.boxStyles, id) || A.byId(D.accessories, id); };
  A.context = function (id) { return A.byId(D.contexts, id); };
  A.flyImg = function (typeId, cls) {
    var t = A.flyType(typeId);
    return '<img class="' + (cls || "fly-img") + '" src="images/flies/' + (t.id === "other" ? "nymph" : t.id) + '.png" alt="">';
  };
  A.boxImg = function (styleId, cls) {
    return '<img class="' + (cls || "box-img") + '" src="images/boxes/' + (A.boxStyle(styleId) ? styleId : "slitfoam") + '.png" alt="">';
  };

  /* fly name: pattern if known, otherwise e.g. "Olive nymph" */
  A.flyName = function (f) {
    if (A.trim(f.pattern)) { return f.pattern; }
    var c = A.color(f.color), t = A.flyType(f.type);
    var n = (c ? c.name + " " : "") + t.one;
    return n.charAt(0).toUpperCase() + n.slice(1);
  };
  A.flyDetail = function (f) {
    var bits = [], c = A.color(f.color);
    if (c) { bits.push(c.name); }
    if (f.hook && f.hook !== "Standard") { bits.push(f.hook + " hook"); }
    if (f.bead && f.bead !== "None") { bits.push((f.beadSize ? f.beadSize + " " : "") + f.bead.toLowerCase()); }
    if (f.weight) { bits.push(f.weight); }
    if (!A.trim(f.pattern)) { bits.push("name unknown"); }
    return bits.join(" · ");
  };

  /* hook sizes: rank so that bigger flies come first. 2/0 -> -2, 1/0 -> -1, 2 -> 2, 18 -> 18 */
  A.sizeRank = function (sz) {
    var s = String(sz || "").replace(/[#\s]/g, "");
    if (!s) { return 999; }
    var m = s.match(/^(\d+)\/0$/);
    if (m) { return -parseInt(m[1], 10); }
    var n = parseInt(s, 10);
    return isNaN(n) ? 999 : n;
  };
  A.sizeLabel = function (sz) { return sz ? "#" + String(sz).replace("#", "") : ""; };
  A.sizeRange = function (flies) {
    var lo = null, hi = null;
    for (var i = 0; i < flies.length; i++) {
      var r = A.sizeRank(flies[i].size);
      if (r === 999) { continue; }
      if (lo === null || r < A.sizeRank(lo)) { lo = flies[i].size; }
      if (hi === null || r > A.sizeRank(hi)) { hi = flies[i].size; }
    }
    if (lo === null) { return ""; }
    return String(lo) === String(hi) ? A.sizeLabel(lo) : A.sizeLabel(lo) + "–" + A.sizeLabel(hi);
  };

  /* guess a fly category from a section or box name; the keyword found latest in the name wins */
  A.guessType = function (name) {
    var s = " " + String(name || "").toLowerCase(), best = null, bestPos = -1, bestLen = 0;
    for (var i = 0; i < D.flyTypes.length; i++) {
      var t = D.flyTypes[i];
      for (var j = 0; j < t.words.length; j++) {
        var w = t.words[j], from = 0, pos;
        while ((pos = s.indexOf(w, from)) >= 0) {
          var before = s.charAt(pos - 1);
          if (!/[a-z]/.test(before)) {
            if (pos > bestPos || (pos === bestPos && w.length > bestLen)) { best = t.id; bestPos = pos; bestLen = w.length; }
          }
          from = pos + 1;
        }
      }
    }
    return best;
  };

  A.boxFlies = function (box) {
    var out = [];
    for (var i = 0; i < box.panels.length; i++) {
      for (var j = 0; j < box.panels[i].flies.length; j++) { out.push(box.panels[i].flies[j]); }
    }
    return out;
  };
  A.boxCount = function (box) {
    var fl = A.boxFlies(box), n = 0;
    for (var i = 0; i < fl.length; i++) { n += parseInt(fl[i].qty, 10) || 0; }
    return n;
  };
  A.findFly = function (box, flyId) {
    for (var i = 0; i < box.panels.length; i++) {
      var j = A.indexById(box.panels[i].flies, flyId);
      if (j >= 0) { return { panel: box.panels[i], index: j, fly: box.panels[i].flies[j] }; }
    }
    return null;
  };
  /* restock: out of a fly, or down to 1 from a bigger count. Anglers who don't count never see noise. */
  A.isLow = function (f) { var q = parseInt(f.qty, 10) || 0; return q === 0 || (q <= 1 && (f.max || 0) > 1); };
  A.touchMax = function (f) { f.max = Math.max(f.max || 0, parseInt(f.qty, 10) || 0); };
  A.kindName = function (box) { return box.kind === "puck" ? "Day box or puck" : "Fly box"; };

  /* chips: <button class="chip" data-action="chip" data-group="g" data-val="v"> ; single groups have data-single */
  A.chips = function (group, items, selected, single) {
    var h = '<div class="chips" data-chipgroup="' + group + '">';
    for (var i = 0; i < items.length; i++) {
      var it = items[i], v = it.id != null ? it.id : it, label = it.name || it, on = false;
      if (selected instanceof Array) { on = selected.indexOf(v) >= 0; } else { on = selected === v; }
      h += '<button type="button" class="chip' + (on ? " on" : "") + '" data-action="chip" data-group="' + group + '" data-val="' + A.esc(v) + '"' + (single ? ' data-single="1"' : "") + ">" +
        (it.hex ? '<span class="sw" style="background:' + it.hex + '"></span>' : "") + A.esc(label) + "</button>";
    }
    return h + "</div>";
  };
  A.chipValues = function (group) {
    var els = document.querySelectorAll('.chip.on[data-group="' + group + '"]'), out = [];
    for (var i = 0; i < els.length; i++) { out.push(els[i].getAttribute("data-val")); }
    return out;
  };

  /* example layout drawing (no flies): sections with a sample fly picture */
  A.layoutVisual = function (L) {
    var h = '<div class="flybox' + (L.kind === "puck" ? " puck" : "") + '"><div class="flybox-title">' + A.esc(L.name) +
      '<span class="example-tag">Example</span></div><div class="panels">';
    for (var i = 0; i < L.sections.length; i++) {
      var t = A.guessType(L.sections[i]);
      h += '<div class="panel ex"><div class="panel-name"><span>' + A.esc(L.sections[i]) + "</span></div>" +
        (t ? A.flyImg(t, "ex-fly") : "") + "</div>";
    }
    return h + "</div></div>";
  };

  /* create empty boxes from layouts; never adds flies */
  A.createBoxes = function (layouts, approachId) {
    for (var i = 0; i < layouts.length; i++) {
      var L = layouts[i];
      var box = { id: A.uid(), name: L.name, kind: L.kind || "box", approach: approachId || "", style: L.kind === "puck" ? "puck" : "", panels: [], created: Date.now() };
      for (var j = 0; j < L.sections.length; j++) { box.panels.push({ id: A.uid(), name: L.sections[j], flies: [] }); }
      A.state.boxes.push(box);
    }
    A.save();
    return layouts.length;
  };
  A.layoutsFor = function (a, ctx) {
    if (a.layouts.all) { return a.layouts.all; }
    if (ctx === "mix" || !ctx || !a.layouts[ctx]) { ctx = "trout"; }
    return a.layouts[ctx];
  };

  /* ======================= TOAST & SHEET ======================= */
  var toastEl, toastTimer, sheetEl, sheetPanel;
  A.toast = function (msg) {
    toastEl.textContent = msg;
    toastEl.className = "toast";
    if (toastTimer) { clearTimeout(toastTimer); }
    toastTimer = setTimeout(function () { toastEl.className = "toast hidden"; }, 2400);
  };
  A.sheetCtx = {};
  A.openSheet = function (title, html, ctx) {
    A.sheetCtx = ctx || {};
    sheetPanel.innerHTML = '<div class="sheet-head"><h2>' + A.esc(title) + '</h2><button class="close-x" data-action="close-sheet" aria-label="Close">&times;</button></div>' + html;
    sheetEl.className = "sheet";
    sheetPanel.scrollTop = 0;
  };
  A.closeSheet = function () { sheetEl.className = "sheet hidden"; sheetPanel.innerHTML = ""; A.sheetCtx = {}; };
  A.sheetOpen = function () { return sheetEl.className.indexOf("hidden") < 0; };

  /* ======================= ROUTER ======================= */
  var viewEl;
  A.route = function () {
    var hash = (location.hash || "").replace(/^#/, "");
    if (!hash) { hash = "boxes"; }
    var parts = hash.split("/"), r = A.routes[parts[0]] || A.routes.boxes;
    viewEl.innerHTML = r.render(parts);
    var tab = r.tab, links = document.querySelectorAll(".tabbar a");
    for (var i = 0; i < links.length; i++) {
      links[i].className = links[i].getAttribute("data-tab") === tab ? "active" : "";
    }
    if (r.after) { r.after(parts); }
  };
  A.rerender = function () { var y = window.pageYOffset; A.route(); window.scrollTo(0, y); };
  A.go = function (hash) {
    if (location.hash === hash) { A.route(); } else { location.hash = hash; }
    window.scrollTo(0, 0);
  };

  function closest(el, attr) {
    while (el && el !== document) {
      if (el.getAttribute && el.getAttribute(attr) !== null) { return el; }
      el = el.parentNode;
    }
    return null;
  }

  /* ======================= COMMON ACTIONS ======================= */
  A.actions["close-sheet"] = function () { A.closeSheet(); };
  A.actions.chip = function (el) {
    var group = el.getAttribute("data-group");
    if (el.getAttribute("data-single")) {
      var on = el.className.indexOf(" on") >= 0;
      var sibs = document.querySelectorAll('.chip[data-group="' + group + '"]');
      for (var i = 0; i < sibs.length; i++) { sibs[i].className = "chip"; }
      if (!on) { el.className = "chip on"; }
    } else {
      el.className = el.className.indexOf(" on") >= 0 ? "chip" : "chip on";
    }
    var hook = A.onChange["chip:" + group];
    if (hook) { hook(el); }
  };
  A.actions.stepper = function (el) {
    var input = document.getElementById(el.getAttribute("data-target"));
    var n = (parseInt(input.value, 10) || 0) + parseInt(el.getAttribute("data-d"), 10);
    var max = input.getAttribute("max");
    if (max !== null && max !== "" && n > parseInt(max, 10)) { n = parseInt(max, 10); }
    input.value = Math.max(0, n);
    var hook = A.onChange["stepper:" + input.getAttribute("data-kind")];
    if (hook) { hook(input); }
  };
  A.stepper = function (id, value, max, kind) {
    return '<div class="stepper"><button type="button" data-action="stepper" data-target="' + id + '" data-d="-1" aria-label="Less">&minus;</button>' +
      '<input type="number" inputmode="numeric" min="0"' + (max != null ? ' max="' + max + '"' : "") + ' id="' + id + '" value="' + value + '"' + (kind ? ' data-kind="' + kind + '"' : "") + ">" +
      '<button type="button" data-action="stepper" data-target="' + id + '" data-d="1" aria-label="More">+</button></div>';
  };
  A.actions["set-water"] = function (el) {
    A.state.profile.water = el.getAttribute("data-water");
    A.save(); A.rerender();
  };
  A.waterChips = function (current, action) {
    var h = '<div class="chips">';
    var opts = D.contexts.concat([{ id: "mix", short: "A mix" }]);
    for (var i = 0; i < opts.length; i++) {
      h += '<button type="button" class="chip' + (current === opts[i].id ? " on" : "") + '" data-action="' + (action || "set-water") + '" data-water="' + opts[i].id + '">' + A.esc(opts[i].short) + "</button>";
    }
    return h + "</div>";
  };

  /* ======================= UPDATES ======================= */
  function showUpdateBar() {
    if (document.getElementById("updateBar")) { return; }
    var bar = document.createElement("div");
    bar.id = "updateBar";
    bar.className = "update-bar";
    bar.innerHTML = '<span>A new version of Angler\'s Fly Boxes is ready.</span><button class="btn sm" id="updateNow">Update now</button>';
    document.body.appendChild(bar);
    document.getElementById("updateNow").addEventListener("click", function () { window.location.reload(); });
  }
  A.actions["check-update"] = function () {
    if (!("serviceWorker" in navigator)) { window.location.reload(); return; }
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg) { window.location.reload(); return; }
      A.toast("Checking…");
      reg.update().then(function () {
        setTimeout(function () { if (!document.getElementById("updateBar")) { A.toast("You're on the latest version"); } }, 2500);
      }, function () { A.toast("Couldn't reach the server"); });
    });
  };
  function setupUpdates() {
    if (!("serviceWorker" in navigator) || !(location.protocol === "https:" || location.hostname === "localhost")) { return; }
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (!hadController) { hadController = true; return; }
      showUpdateBar();
    });
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        function check() { reg.update().then(null, function () {}); }
        /* iPad home-screen apps resume instead of relaunching, so check whenever the app comes back */
        document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") { check(); } });
        window.addEventListener("focus", check);
        window.addEventListener("online", check);
        setInterval(check, 30 * 60 * 1000);
      }, function () {});
    });
  }

  /* ======================= BACKUP & ABOUT ======================= */
  A.backupCard = function () {
    return '<div class="card"><h3>Backup</h3><p class="small">Your boxes are saved on this device only. Export a backup file to keep them safe or move them to another device.</p>' +
      '<div class="btn-row"><button class="btn sm sand" data-action="export">Export backup</button><button class="btn sm ghost" data-action="import">Import backup</button></div>' +
      '<input type="file" id="importFile" accept="application/json,.json" class="hidden"></div>';
  };
  A.actions["export"] = function () {
    var data = JSON.stringify({ app: "anglers-fly-boxes", version: D.version, exported: new Date().toISOString(), state: A.state }, null, 2);
    var blob = new Blob([data], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "anglers-fly-boxes-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 1000);
    A.toast("Backup file saved");
  };
  A.actions["import"] = function () { var f = document.getElementById("importFile"); if (f) { f.click(); } };
  function doImport(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var obj = JSON.parse(r.result);
        var s = obj && obj.state ? obj.state : obj;
        if (!s || !(s.boxes instanceof Array)) { throw new Error("bad"); }
        if (!confirm("Replace your current boxes and trips with this backup?")) { return; }
        A.replaceState(s); A.closeSheet(); A.rerender(); A.toast("Backup restored");
      } catch (e) { A.toast("That file isn't an Angler's Fly Boxes backup"); }
    };
    r.readAsText(file);
  }
  A.actions["reset-all"] = function () {
    if (!confirm("Erase all boxes, trips and answers on this device?")) { return; }
    A.resetState(); A.closeSheet(); A.go("#boxes"); A.toast("All data erased");
  };
  function aboutSheet() {
    var h = '<div style="text-align:center"><img src="images/logo-512.png" alt="" style="width:120px;height:120px"></div>';
    h += '<p style="text-align:center"><b>Angler\'s Fly Boxes</b> ' + D.version + '<br><span class="small muted">An ARTEZIQ app</span></p>';
    h += "<p>Organize your flies, find them fast, and pack the right ones for each trip.</p>";
    h += '<div class="card"><h3>Install it</h3><p class="small" style="margin:0">On iPhone or iPad, tap <b>Share</b> then <b>Add to Home Screen</b>. It opens full screen and works offline.</p></div>';
    h += '<div class="card"><h3>Updates</h3><p class="small">You\'re on <b>' + D.version + '</b>. New versions download on their own; you\'ll see an <b>Update now</b> bar when one is ready.</p><button class="btn sm ghost" data-action="check-update">Check for updates</button></div>';
    h += A.backupCard();
    h += '<div class="section-label">Danger zone</div><button class="btn block danger" data-action="reset-all">Erase all my boxes and trips</button>';
    h += '<p class="footer-note">Guidance gathered from the fly fishing community. Your data stays on this device.</p>';
    h += '<p class="footer-note">' + A.esc(D.shop.disclosure) + "</p>";
    return h;
  }

  /* ======================= EVENTS & START ======================= */
  function start() {
    viewEl = document.getElementById("view");
    sheetEl = document.getElementById("sheet");
    sheetPanel = document.getElementById("sheetPanel");
    toastEl = document.getElementById("toast");

    document.addEventListener("click", function (e) {
      var el = closest(e.target, "data-action");
      if (el && el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" && el.tagName !== "SELECT") {
        var fn = A.actions[el.getAttribute("data-action")];
        if (fn) { e.preventDefault(); fn(el, e); return; }
      }
      var g = closest(e.target, "data-go");
      if (g) { A.go(g.getAttribute("data-go")); }
    });
    document.addEventListener("change", function (e) {
      var el = e.target;
      if (el.id === "importFile" && el.files && el.files[0]) { doImport(el.files[0]); el.value = ""; return; }
      var act = el.getAttribute && el.getAttribute("data-action");
      if (act && A.onChange[act]) { A.onChange[act](el); }
    });
    document.addEventListener("input", function (e) {
      var el = e.target, act = el.getAttribute && el.getAttribute("data-action");
      if (act && A.onInput[act]) { A.onInput[act](el); }
      var kind = el.getAttribute && el.getAttribute("data-kind");
      if (kind && A.onChange["stepper:" + kind]) { A.onChange["stepper:" + kind](el); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.keyCode === 27 && A.sheetOpen()) { A.closeSheet(); }
    });
    document.getElementById("aboutBtn").addEventListener("click", function () { A.openSheet("About & settings", aboutSheet()); });
    window.addEventListener("hashchange", function () { A.route(); window.scrollTo(0, 0); });
    A.route();
  }

  setupUpdates();
  document.addEventListener("DOMContentLoaded", start);
})();
