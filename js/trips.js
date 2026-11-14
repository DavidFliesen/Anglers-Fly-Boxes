/* Angler's Fly Boxes - Trips: plans, season starting points, day box packing (moves flies), kits (ES5 only) */
(function () {
  "use strict";
  var A = window.AFB, D = A.D, esc = A.esc;
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function seasonFor(ctx, m) {
    var list = D.seasons[ctx] || D.seasons.trout;
    for (var i = 0; i < list.length; i++) { if (list[i].months.indexOf(m) >= 0) { return list[i]; } }
    return list[0];
  }
  function seasonCard(ctx, m, title) {
    var s = seasonFor(ctx, m), h = '<div class="card accent"><h3>' + esc(title || s.name + " starting points") + '</h3><ul class="clean">';
    for (var i = 0; i < s.hints.length; i++) { h += "<li>" + esc(s.hints[i]) + "</li>"; }
    return h + '</ul><p class="small muted" style="margin:0">General ' + esc(A.context(ctx).name.toLowerCase()) + " guide. Local reports, fly shops and hatch charts beat this.</p></div>";
  }

  /* ======================= TRIPS LIST ======================= */
  function viewTrips() {
    var h = '<div class="page-head"><h1>Trips</h1><button class="btn" data-action="new-trip">+ Plan a trip</button></div>';
    h += '<p class="muted">Pick the water, then move just the flies you need into a day box or puck.</p>';
    if (A.state.trips.length) {
      h += '<div class="section-label">Your trips</div><div class="grid2">';
      for (var i = A.state.trips.length - 1; i >= 0; i--) {
        var t = A.state.trips[i], done = 0, k, puck = t.puckId ? A.byId(A.state.boxes, t.puckId) : null;
        for (k in t.checks) { if (t.checks.hasOwnProperty(k) && t.checks[k]) { done++; } }
        h += '<div class="card tap" data-go="#trip/' + t.id + '"><div class="card-row"><div class="card-ico">🏞️</div><div class="card-body"><h3>' + esc(t.name) + "</h3>" +
          '<p class="small muted" style="margin:0">' + esc([t.place, t.species, MONTHS[t.month]].filter(function (x) { return !!x; }).join(" · ")) + "</p>" +
          '<p class="small" style="margin:4px 0 0">' + done + " of " + D.tripChecklist.length + " prep steps" + (puck ? " · " + A.count(A.boxCount(puck), "fly", "flies") + " packed" : "") + '</p></div><div class="chev">&#8250;</div></div></div>';
      }
      h += "</div>";
    }
    var w = A.state.profile.water, m = new Date().getMonth();
    h += '<div class="section-label">This season</div>';
    if (!w || w === "mix") {
      h += '<div class="card"><p class="small" style="margin:0 0 8px">What do you fish for? Season tips depend on your water.</p>' + A.waterChipsNoMix() + "</div>";
    } else {
      h += seasonCard(w, m, seasonFor(w, m).name + " on " + A.context(w).name.toLowerCase());
      h += '<p class="small muted">Not your water? ' + A.waterChipsNoMix() + "</p>";
    }
    h += '<div class="section-label">Ready-to-go kits</div>';
    var kits = D.kits.slice(0);
    kits.sort(function (a, b) { return (a.water === w ? 0 : 1) - (b.water === w ? 0 : 1); });
    for (var x = 0; x < kits.length; x++) {
      var kit = kits[x], ks = A.state.kits[kit.id] || {}, kd = 0;
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
  A.waterChipsNoMix = function () {
    var h = '<span class="chips inline">', cur = A.state.profile.water;
    for (var i = 0; i < D.contexts.length; i++) {
      h += '<button type="button" class="chip' + (cur === D.contexts[i].id ? " on" : "") + '" data-action="set-water" data-water="' + D.contexts[i].id + '">' + esc(D.contexts[i].short) + "</button>";
    }
    return h + "</span>";
  };

  /* ---------- kits ---------- */
  function updateKitCount(kid) {
    var kit = A.byId(D.kits, kid), ks = A.state.kits[kid] || {}, n = 0;
    for (var i = 0; i < kit.items.length; i++) { if (ks[i]) { n++; } }
    var el = document.getElementById("kitcount-" + kid);
    if (el) { el.textContent = n + "/" + kit.items.length + " packed"; }
  }
  A.onChange["kit-check"] = function (el) {
    var kid = el.getAttribute("data-kit");
    if (!A.state.kits[kid]) { A.state.kits[kid] = {}; }
    A.state.kits[kid][el.getAttribute("data-i")] = el.checked;
    A.save();
    el.parentNode.className = "check" + (el.checked ? " done" : "");
    updateKitCount(kid);
  };
  A.actions["kit-reset"] = function (el) {
    var kid = el.getAttribute("data-kit");
    A.state.kits[kid] = {}; A.save();
    var boxes = document.querySelectorAll('input[data-kit="' + kid + '"]');
    for (var i = 0; i < boxes.length; i++) { boxes[i].checked = false; boxes[i].parentNode.className = "check"; }
    updateKitCount(kid); A.toast("Kit unpacked");
  };

  /* ======================= TRIP FORM ======================= */
  function tripForm(t) {
    t = t || { name: "", water: A.state.profile.water && A.state.profile.water !== "mix" ? A.state.profile.water : "", place: "", species: "", month: new Date().getMonth() };
    var i, h = '<label class="f" for="tName">Trip name</label><input type="text" id="tName" value="' + esc(t.name) + '" placeholder="e.g. Saturday on the creek">';
    h += '<label class="f" for="tWater">Kind of water</label><select id="tWater"><option value="">Choose…</option>';
    for (i = 0; i < D.contexts.length; i++) { h += '<option value="' + D.contexts[i].id + '"' + (t.water === D.contexts[i].id ? " selected" : "") + ">" + esc(D.contexts[i].name) + "</option>"; }
    h += "</select>";
    h += '<label class="f" for="tPlace">Where <span class="opt">optional</span></label><input type="text" id="tPlace" value="' + esc(t.place || "") + '" placeholder="River, beach, flats or pond">';
    h += '<label class="f" for="tSpecies">Target fish <span class="opt">optional</span></label><input type="text" id="tSpecies" value="' + esc(t.species || "") + '" placeholder="e.g. Brown trout, redfish, bluegill">';
    h += '<label class="f" for="tMonth">Month</label><select id="tMonth">';
    for (i = 0; i < 12; i++) { h += '<option value="' + i + '"' + (t.month === i ? " selected" : "") + ">" + MONTHS[i] + "</option>"; }
    h += "</select>";
    h += '<button class="btn block" data-action="save-trip">' + (t.id ? "Save" : "Create trip") + "</button>";
    if (t.id) { h += '<button class="btn block danger" data-action="delete-trip">Delete trip</button>'; }
    return h;
  }
  A.actions["new-trip"] = function () { A.openSheet("Plan a trip", tripForm(null), {}); };
  A.actions["edit-trip"] = function (el) { A.openSheet("Edit trip", tripForm(A.byId(A.state.trips, el.getAttribute("data-id"))), { trip: el.getAttribute("data-id") }); };
  A.actions["save-trip"] = function () {
    var name = A.trim(A.val("tName"));
    if (!name) { A.toast("Name your trip"); return; }
    var t = A.sheetCtx.trip ? A.byId(A.state.trips, A.sheetCtx.trip) : { id: A.uid(), checks: {}, notes: "", puckId: null };
    t.name = name; t.water = A.val("tWater"); t.place = A.trim(A.val("tPlace")); t.species = A.trim(A.val("tSpecies")); t.month = parseInt(A.val("tMonth"), 10);
    if (!A.sheetCtx.trip) { A.state.trips.push(t); }
    A.save(); A.closeSheet(); A.go("#trip/" + t.id);
  };
  A.actions["delete-trip"] = function () {
    if (!confirm("Delete this trip? Its day box stays in My Boxes.")) { return; }
    A.state.trips.splice(A.indexById(A.state.trips, A.sheetCtx.trip), 1);
    A.save(); A.closeSheet(); A.go("#trips");
  };
  A.actions["set-trip-water"] = function (el) {
    var t = A.byId(A.state.trips, el.getAttribute("data-id"));
    t.water = el.getAttribute("data-water"); A.save(); A.rerender();
  };

  /* ======================= TRIP VIEW ======================= */
  function viewTrip(parts) {
    var t = A.byId(A.state.trips, parts[1]), i;
    if (!t) { return viewTrips(); }
    var h = '<a class="back" href="#trips">&#8249; Trips</a><div class="page-head"><h1>' + esc(t.name) + '</h1><button class="btn sm ghost" data-action="edit-trip" data-id="' + t.id + '">Edit</button></div>';
    h += "<p>" + (t.water ? '<span class="pill deep">' + esc(A.context(t.water).short) + "</span>" : "") + (t.place ? '<span class="pill">' + esc(t.place) + "</span>" : "") +
      (t.species ? '<span class="pill">' + esc(t.species) + "</span>" : "") + '<span class="pill">' + MONTHS[t.month] + "</span></p>";

    if (t.water) { h += seasonCard(t.water, t.month); }
    else {
      h += '<div class="card"><p class="small" style="margin:0 0 8px">What kind of water? Tips depend on it.</p><div class="chips">';
      for (i = 0; i < D.contexts.length; i++) { h += '<button type="button" class="chip" data-action="set-trip-water" data-id="' + t.id + '" data-water="' + D.contexts[i].id + '">' + esc(D.contexts[i].short) + "</button>"; }
      h += "</div></div>";
    }

    h += '<h2>Day box or puck</h2>';
    var puck = t.puckId ? A.byId(A.state.boxes, t.puckId) : null;
    if (puck && A.boxFlies(puck).length) {
      h += '<div class="card"><div class="card-row">' + A.boxImg(puck.style || "puck", "card-img") + '<div class="card-body"><h3>' + esc(puck.name) + '</h3><p class="small muted" style="margin:0">' + A.count(A.boxCount(puck), "fly", "flies") + " packed</p></div></div>";
      h += '<div class="pack-list">';
      var fl = A.boxFlies(puck);
      for (i = 0; i < fl.length; i++) {
        h += '<div class="pack-row">' + A.flyImg(fl[i].type, "row-img") + "<span><b>" + esc(A.sizeLabel(fl[i].size)) + "</b> " + esc(A.flyName(fl[i])) + '</span><span class="row-qty">×' + fl[i].qty + "</span></div>";
      }
      h += '</div><div class="btn-row"><button class="btn sm" data-action="pack" data-id="' + t.id + '">Pack more</button><a class="btn sm ghost" href="#box/' + puck.id + '">Open</a>' +
        '<button class="btn sm light" data-action="unpack" data-box="' + puck.id + '">Unpack to my boxes</button></div>' +
        '<p class="small muted" style="margin:6px 0 0">Lost or gave away a few? Lower the count in the day box first, then unpack.</p></div>';
    } else {
      h += '<div class="card"><p>Move just the flies you expect to use into a small day box or puck. They come out of your boxes, so your counts stay true. When you get home, unpack what\'s left.</p>' +
        '<button class="btn" data-action="pack" data-id="' + t.id + '">Pack a day box or puck</button></div>';
    }

    h += '<h2>What are the fish eating?</h2><p class="small muted">Notes from a hatch chart, fly shop, report or your own eyes.</p>' +
      '<textarea id="tripNotes" data-action="trip-notes" data-id="' + t.id + '" placeholder="e.g. Tan caddis #14-16 in the evening; shrimp on the flats at low tide">' + esc(t.notes || "") + "</textarea>";
    h += '<h2>Prep checklist</h2><div class="card">';
    for (i = 0; i < D.tripChecklist.length; i++) {
      var on = t.checks && t.checks[i];
      h += '<label class="check' + (on ? " done" : "") + '"><input type="checkbox" data-action="trip-check" data-id="' + t.id + '" data-i="' + i + '"' + (on ? " checked" : "") + "><span>" + esc(D.tripChecklist[i]) + "</span></label>";
    }
    return h + "</div>";
  }
  A.onChange["trip-check"] = function (el) {
    var t = A.byId(A.state.trips, el.getAttribute("data-id"));
    if (!t.checks) { t.checks = {}; }
    t.checks[el.getAttribute("data-i")] = el.checked;
    el.parentNode.className = "check" + (el.checked ? " done" : "");
    A.save();
  };
  A.onInput["trip-notes"] = function (el) {
    var t = A.byId(A.state.trips, el.getAttribute("data-id"));
    if (t) { t.notes = el.value; A.save(); }
  };

  /* ======================= PACKING (moves flies) ======================= */
  A.actions.pack = function (el) {
    var t = A.byId(A.state.trips, el.getAttribute("data-id")), i, j, k;
    var pucks = [];
    for (i = 0; i < A.state.boxes.length; i++) { if (A.state.boxes[i].kind === "puck") { pucks.push(A.state.boxes[i]); } }
    var h = '<p class="small muted">Choose how many of each fly to move. They\'re taken out of their box and put in the day box, so you never count a fly twice.</p>';
    h += '<label class="f" for="packInto">Put them in</label><select id="packInto">';
    if (!t.puckId) { h += '<option value="">A new day box: “' + esc(t.name) + '”</option>'; }
    for (i = 0; i < pucks.length; i++) { h += '<option value="' + pucks[i].id + '"' + (pucks[i].id === t.puckId ? " selected" : "") + ">" + esc(pucks[i].name) + "</option>"; }
    h += "</select>";
    var any = false;
    for (i = 0; i < A.state.boxes.length; i++) {
      var b = A.state.boxes[i];
      if (b.kind === "puck") { continue; }
      var rows = "";
      for (j = 0; j < b.panels.length; j++) {
        for (k = 0; k < b.panels[j].flies.length; k++) {
          var f = b.panels[j].flies[k];
          if ((f.qty || 0) < 1) { continue; }
          rows += '<div class="pack-pick">' + A.flyImg(f.type, "row-img") + '<div class="row-main"><div><b>' + esc(A.sizeLabel(f.size)) + "</b> " + esc(A.flyName(f)) + '</div><div class="small muted">' + esc(b.panels[j].name) + " · you have " + f.qty + "</div></div>" +
            A.stepper("pk_" + b.id + "_" + f.id, 0, f.qty, "pack") + "</div>";
        }
      }
      if (rows) { any = true; h += '<div class="section-label">' + esc(b.name) + '</div><div class="card list-card">' + rows + "</div>"; }
    }
    if (!any) {
      h += '<div class="card warn"><p style="margin:0">There are no flies in your boxes yet. Add some in <b>My Boxes</b> first, or create an empty day box and fill it as you go.</p></div>' +
        '<button class="btn block" data-action="do-pack">Create an empty day box</button>';
    } else {
      h += '<div class="pack-bar"><span id="packTotal">Nothing chosen yet</span><button class="btn" data-action="do-pack">Move flies</button></div>';
    }
    A.openSheet("Pack a day box or puck", h, { trip: t.id });
  };
  A.onChange["stepper:pack"] = function () {
    var inputs = document.querySelectorAll('input[data-kind="pack"]'), n = 0;
    for (var i = 0; i < inputs.length; i++) { n += parseInt(inputs[i].value, 10) || 0; }
    var el = document.getElementById("packTotal");
    if (el) { el.textContent = n ? "Moving " + A.count(n, "fly", "flies") : "Nothing chosen yet"; }
  };

  function sectionFor(puck, type) {
    var i, name = A.flyType(type).name;
    for (i = 0; i < puck.panels.length; i++) { if (A.guessType(puck.panels[i].name) === type || puck.panels[i].name === name) { return puck.panels[i]; } }
    if (puck.panels.length === 1 && !A.guessType(puck.panels[0].name)) { return puck.panels[0]; }
    var p = { id: A.uid(), name: name, flies: [] };
    puck.panels.push(p);
    return p;
  }

  A.actions["do-pack"] = function () {
    var t = A.byId(A.state.trips, A.sheetCtx.trip), into = A.val("packInto"), puck = into ? A.byId(A.state.boxes, into) : null;
    var inputs = document.querySelectorAll('input[data-kind="pack"]'), moved = 0, i;
    var picks = [];
    for (i = 0; i < inputs.length; i++) {
      var n = parseInt(inputs[i].value, 10) || 0;
      if (n > 0) { var bits = inputs[i].id.split("_"); picks.push({ box: bits[1], fly: bits[2], n: n }); }
    }
    if (inputs.length && !picks.length) { A.toast("Choose at least one fly"); return; }
    if (!puck) {
      puck = { id: A.uid(), name: "Day box: " + t.name, kind: "puck", style: "puck", approach: "puck", panels: [], created: Date.now() };
      A.state.boxes.push(puck);
    }
    t.puckId = puck.id;
    for (i = 0; i < picks.length; i++) {
      var src = A.byId(A.state.boxes, picks[i].box), hit = src ? A.findFly(src, picks[i].fly) : null;
      if (!hit) { continue; }
      var n2 = Math.min(picks[i].n, hit.fly.qty || 0);
      if (n2 < 1) { continue; }
      hit.fly.qty -= n2;
      var existing = null, fl = A.boxFlies(puck);
      for (var j = 0; j < fl.length; j++) { if (fl[j].from && fl[j].from.fly === hit.fly.id) { existing = fl[j]; } }
      if (existing) { existing.qty += n2; }
      else {
        var copy = {}, k;
        for (k in hit.fly) { if (hit.fly.hasOwnProperty(k)) { copy[k] = hit.fly[k]; } }
        copy.id = A.uid(); copy.qty = n2; copy.from = { box: src.id, fly: hit.fly.id };
        sectionFor(puck, copy.type).flies.push(copy);
      }
      moved += n2;
    }
    if (!puck.panels.length) { puck.panels.push({ id: A.uid(), name: "Today's flies", flies: [] }); }
    if (!t.checks) { t.checks = {}; }
    if (moved) { t.checks[3] = true; }
    A.save(); A.closeSheet(); A.rerender();
    A.toast(moved ? "Moved " + A.count(moved, "fly", "flies") + " into " + puck.name : "Empty day box created");
  };

  /* put packed flies back where they came from */
  A.unpackBox = function (puck, quiet) {
    var back = 0, kept = 0;
    for (var i = 0; i < puck.panels.length; i++) {
      var p = puck.panels[i];
      for (var j = p.flies.length - 1; j >= 0; j--) {
        var f = p.flies[j];
        if (!f.from) { continue; }
        var src = A.byId(A.state.boxes, f.from.box);
        if (!src) { delete f.from; kept++; continue; }
        var hit = A.findFly(src, f.from.fly);
        if (hit) { hit.fly.qty = (parseInt(hit.fly.qty, 10) || 0) + (f.qty || 0); A.touchMax(hit.fly); }
        else {
          var copy = {}, k;
          for (k in f) { if (f.hasOwnProperty(k) && k !== "from") { copy[k] = f[k]; } }
          copy.id = A.uid();
          src.panels[0].flies.push(copy);
        }
        back += f.qty || 0;
        p.flies.splice(j, 1);
      }
    }
    if (!quiet) { A.toast(back ? "Put back " + A.count(back, "fly", "flies") + (kept ? " (" + kept + " stayed: their box is gone)" : "") : "Nothing to put back"); }
    return back;
  };
  A.actions.unpack = function (el) {
    var puck = A.byId(A.state.boxes, el.getAttribute("data-box"));
    if (!puck) { return; }
    A.unpackBox(puck, false);
    A.save(); A.rerender();
  };

  /* ======================= ROUTES ======================= */
  A.routes.trips = { tab: "trips", render: viewTrips };
  A.routes.trip = { tab: "trips", render: viewTrip };
})();
