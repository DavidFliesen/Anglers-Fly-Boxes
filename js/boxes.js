/* Angler's Fly Boxes - My Boxes: boxes, sections, fly entry, search, sort, labels (ES5 only) */
(function () {
  "use strict";
  var A = window.AFB, D = A.D, esc = A.esc;

  /* ======================= MY BOXES (home) ======================= */
  function lowFlies() {
    var out = [];
    for (var i = 0; i < A.state.boxes.length; i++) {
      var b = A.state.boxes[i];
      if (b.kind === "puck") { continue; }
      var fl = A.boxFlies(b);
      for (var j = 0; j < fl.length; j++) { if (A.isLow(fl[j])) { out.push({ box: b, fly: fl[j] }); } }
    }
    return out;
  }

  function welcome() {
    var h = '<div class="welcome"><img src="images/logo-512.png" alt="Angler\'s Fly Boxes" class="welcome-logo">';
    h += "<h1>Let's get your flies organized</h1>";
    h += '<p class="muted">Sort the flies you have into boxes that make sense, find any fly fast, and pack just the right ones for each trip.</p>';
    h += '<div class="big-actions"><a class="big-btn" href="#quiz"><b>Help me organize</b><span>Answer 5 quick questions and get a setup that fits how you fish.</span></a>' +
      '<button class="big-btn alt" data-action="new-box" data-kind="box"><b>Add my first box</b><span>Name a box and its sections. Add flies now or later.</span></button></div></div>';
    h += '<div class="card"><h3>How it works</h3><ol class="clean">' +
      "<li><b>Make a box</b> and name its sections, like Dries, Nymphs, Streamers.</li>" +
      "<li><b>Add flies</b> if you like. A pattern name, size and count are all optional.</li>" +
      "<li><b>Pack a day box or puck</b> for each trip in Trips.</li></ol></div>";
    h += '<div class="card tap" data-go="#finder"><div class="card-row">' + A.boxImg("silicone", "card-img") + '<div class="card-body"><h3>Need a fly box?</h3><p class="small muted" style="margin:0">Box Finder helps you choose the right kind for your flies and how you carry them.</p></div><div class="chev">&#8250;</div></div></div>';
    return h;
  }

  function boxCard(b) {
    var a = A.approach(b.approach), n = A.boxCount(b);
    return '<div class="card tap box-card" data-go="#box/' + b.id + '"><div class="card-row">' + A.boxImg(b.style || (b.kind === "puck" ? "puck" : "slitfoam"), "card-img") +
      '<div class="card-body"><h3>' + esc(b.name) + "</h3>" +
      '<div class="small muted">' + A.count(b.panels.length, "section") + " · " + A.count(n, "fly", "flies") + (a ? " · " + esc(a.name) : "") + "</div></div>" +
      '<div class="chev">&#8250;</div></div></div>';
  }

  function viewBoxes() {
    if (!A.state.boxes.length) { return welcome(); }
    var h = '<div class="page-head"><h1>My Boxes</h1><div class="btn-row"><button class="btn" data-action="new-box" data-kind="box">+ Box</button>' +
      '<button class="btn light" data-action="new-box" data-kind="puck">+ Day box / puck</button></div></div>';
    h += '<div class="search"><input type="search" id="flySearch" data-action="search" placeholder="Search flies: pattern, size, color…" autocomplete="off"></div><div id="searchResults"></div>';
    var low = lowFlies();
    if (low.length) {
      h += '<div class="card warn tap" data-action="show-restock"><div class="card-row"><div class="card-ico coral">🔁</div><div class="card-body"><h3>Restock list</h3><p class="small" style="margin:0">' +
        A.count(low.length, "fly", "flies") + " running low or out</p></div><div class=\"chev\">&#8250;</div></div></div>";
    }
    var groups = [["box", "Boxes"], ["puck", "Day boxes & pucks"]];
    for (var g = 0; g < groups.length; g++) {
      var list = [];
      for (var i = 0; i < A.state.boxes.length; i++) { if (A.state.boxes[i].kind === groups[g][0]) { list.push(A.state.boxes[i]); } }
      if (!list.length) { continue; }
      h += '<div class="section-label">' + groups[g][1] + '</div><div class="grid2">';
      for (i = 0; i < list.length; i++) { h += boxCard(list[i]); }
      h += "</div>";
    }
    h += '<div class="section-label">More</div><div class="grid2">';
    h += '<div class="card tap" data-go="#finder"><div class="card-row">' + A.boxImg("compartment", "card-img") + '<div class="card-body"><h3>Box Finder</h3><p class="small muted" style="margin:0">Which kind of fly box fits your flies?</p></div><div class="chev">&#8250;</div></div></div>';
    h += '<div class="card tap" data-go="#quiz"><div class="card-row"><div class="card-ico">🧭</div><div class="card-body"><h3>Help me organize</h3><p class="small muted" style="margin:0">Get a setup that fits how you fish.</p></div><div class="chev">&#8250;</div></div></div>';
    h += "</div>";
    return h;
  }

  /* ---------- search ---------- */
  A.onInput.search = function (el) {
    var q = A.trim(el.value).toLowerCase(), out = document.getElementById("searchResults");
    if (!out) { return; }
    if (q.length < 2) { out.innerHTML = ""; return; }
    var hits = [], i, j, k;
    for (i = 0; i < A.state.boxes.length; i++) {
      var b = A.state.boxes[i];
      for (j = 0; j < b.panels.length; j++) {
        for (k = 0; k < b.panels[j].flies.length; k++) {
          var f = b.panels[j].flies[k], c = A.color(f.color);
          var hay = [A.flyName(f), A.flyType(f.type).name, c ? c.name : "", A.sizeLabel(f.size), f.size, f.hook, f.bead, f.notes, b.panels[j].name].join(" ").toLowerCase();
          if (hay.indexOf(q) >= 0) { hits.push({ b: b, p: b.panels[j], f: f }); }
        }
      }
    }
    if (!hits.length) { out.innerHTML = '<p class="small muted">No flies match “' + esc(q) + "”.</p>"; return; }
    var h = '<div class="card list-card">';
    for (i = 0; i < hits.length && i < 40; i++) {
      var x = hits[i];
      h += '<div class="fly-row tap" data-action="edit-fly" data-box="' + x.b.id + '" data-fly="' + x.f.id + '">' + A.flyImg(x.f.type, "row-img") +
        '<div class="row-main"><div><b>' + esc(A.sizeLabel(x.f.size)) + "</b> " + esc(A.flyName(x.f)) + '</div><div class="small muted">' + esc(x.b.name) + " › " + esc(x.p.name) + '</div></div><div class="row-qty">×' + x.f.qty + "</div></div>";
    }
    out.innerHTML = h + "</div>";
  };

  /* ======================= BOX VIEW ======================= */
  function chip(b, f) {
    return '<button class="fly-chip' + (A.isLow(f) && b.kind !== "puck" ? " low" : "") + '" data-action="edit-fly" data-box="' + b.id + '" data-fly="' + f.id + '">' +
      A.flyImg(f.type, "chip-img") + (f.size ? '<span class="sz">' + esc(A.sizeLabel(f.size)) + "</span>" : "") + esc(A.flyName(f)) +
      '<span class="qty">×' + f.qty + "</span></button>";
  }

  function boxVisual(b) {
    var h = '<div class="flybox' + (b.kind === "puck" ? " puck" : "") + '"><div class="panels">';
    for (var i = 0; i < b.panels.length; i++) {
      var p = b.panels[i];
      h += '<div class="panel"><div class="panel-name"><span>' + esc(p.name) + '</span><button data-action="section-menu" data-box="' + b.id + '" data-panel="' + p.id + '" aria-label="Section options">&#8943;</button></div>';
      for (var j = 0; j < p.flies.length; j++) { h += chip(b, p.flies[j]); }
      h += '<button class="add-here" data-action="add-fly" data-box="' + b.id + '" data-panel="' + p.id + '">+ Add here</button></div>';
    }
    return h + "</div></div>";
  }

  function boxList(b) {
    var h = "";
    for (var i = 0; i < b.panels.length; i++) {
      var p = b.panels[i];
      h += '<div class="list-section"><div class="list-head"><b>' + esc(p.name) + '</b><span class="small muted">' + A.sizeRange(p.flies) + '</span><span class="grow"></span>' +
        '<button class="btn sm light" data-action="add-fly" data-box="' + b.id + '" data-panel="' + p.id + '">+ Add here</button>' +
        '<button class="icon-mini" data-action="section-menu" data-box="' + b.id + '" data-panel="' + p.id + '" aria-label="Section options">&#8943;</button></div>';
      if (!p.flies.length) { h += '<p class="small muted empty-row">No flies yet.</p>'; }
      for (var j = 0; j < p.flies.length; j++) {
        var f = p.flies[j];
        h += '<div class="fly-row' + (A.isLow(f) && b.kind !== "puck" ? " low" : "") + '"><div class="row-tap tap" data-action="edit-fly" data-box="' + b.id + '" data-fly="' + f.id + '">' + A.flyImg(f.type, "row-img") +
          '<div class="row-main"><div><b>' + esc(A.sizeLabel(f.size)) + "</b> " + esc(A.flyName(f)) + "</div>" +
          '<div class="small muted">' + esc(A.flyDetail(f) || A.flyType(f.type).name) + "</div></div></div>" +
          '<div class="mini-step"><button data-action="qty" data-box="' + b.id + '" data-fly="' + f.id + '" data-d="-1" aria-label="One less">&minus;</button><span>' + f.qty + '</span><button data-action="qty" data-box="' + b.id + '" data-fly="' + f.id + '" data-d="1" aria-label="One more">+</button></div></div>';
      }
      h += "</div>";
    }
    return h;
  }

  function viewBox(parts) {
    var b = A.byId(A.state.boxes, parts[1]);
    if (!b) { return viewBoxes(); }
    var fl = A.boxFlies(b), n = A.boxCount(b), low = 0, packed = 0, i;
    for (i = 0; i < fl.length; i++) { if (A.isLow(fl[i])) { low++; } if (fl[i].from) { packed++; } }
    var view = A.state.prefs.view === "list" ? "list" : "box";
    var st = A.boxStyle(b.style), a = A.approach(b.approach);
    var h = '<a class="back" href="#boxes">&#8249; My Boxes</a>';
    h += '<div class="box-head">' + A.boxImg(b.style || (b.kind === "puck" ? "puck" : "slitfoam"), "head-img") + '<div><h1>' + esc(b.name) + "</h1>" +
      '<div class="small muted">' + A.kindName(b) + (st ? " · " + esc(st.name) : "") + (a ? " · " + esc(a.name) : "") + "</div>" +
      '<div class="small">' + A.count(b.panels.length, "section") + " · " + A.count(fl.length, "entry", "entries") + " · " + A.count(n, "fly", "flies") +
      (low && b.kind !== "puck" ? ' · <span class="hot">' + low + " low</span>" : "") + "</div></div></div>";

    h += '<div class="toolbar"><button class="btn" data-action="add-fly" data-box="' + b.id + '">+ Add fly</button>' +
      '<div class="seg"><button class="' + (view === "box" ? "on" : "") + '" data-action="set-view" data-view="box">Box</button><button class="' + (view === "list" ? "on" : "") + '" data-action="set-view" data-view="list">List</button></div>' +
      '<button class="btn sm ghost" data-action="sort" data-box="' + b.id + '">Sort</button>' +
      '<button class="btn sm ghost" data-action="labels" data-box="' + b.id + '">Labels</button>' +
      '<button class="btn sm ghost" data-action="edit-box" data-box="' + b.id + '">Edit</button></div>';

    if (b.kind === "puck" && packed) {
      h += '<div class="card accent"><p class="small" style="margin:0 0 8px">These flies were moved here from your boxes. When you\'re done fishing, put back what\'s left.</p>' +
        '<button class="btn sm" data-action="unpack" data-box="' + b.id + '">Unpack to my boxes</button></div>';
    }
    h += view === "list" ? boxList(b) : boxVisual(b);
    h += '<div class="btn-row"><button class="btn sm ghost" data-action="add-section" data-box="' + b.id + '">+ Add section</button></div>';
    h += '<p class="small muted">Sections are just groups. A section can be one side of a box, a few rows, or a single compartment.</p>';
    return h;
  }

  A.actions["set-view"] = function (el) { A.state.prefs.view = el.getAttribute("data-view"); A.save(); A.rerender(); };

  /* ======================= FLY FORM ======================= */
  function flyForm(box, panelId, fly, mode) {
    var edit = mode === "edit";
    var f = fly || {};
    var panel = A.byId(box.panels, panelId) || box.panels[0];
    var type = f.type || A.guessType(panel.name) || A.guessType(box.name) || A.state.prefs.lastType || "nymph";
    var i, h = "";
    h += '<label class="f">Category</label>' + A.chips("type", D.flyTypes, type, true);
    h += '<label class="f" for="fPattern">Pattern name <span class="opt">optional</span></label><input type="text" id="fPattern" value="' + esc(f.pattern || "") + '" placeholder="e.g. Pheasant Tail — or leave blank" autocomplete="off">';
    h += '<label class="f">Hook size <span class="opt">' + (edit ? "optional" : "tap one or more") + "</span></label>";
    var sizes = f.size ? [String(f.size)] : [];
    var other = f.size && D.sizes.indexOf(String(f.size)) < 0 ? f.size : "";
    h += A.chips("size", D.sizes, sizes, edit);
    h += '<input type="text" id="fSizeOther" class="mt6" value="' + esc(other) + '" placeholder="Other size' + (edit ? "" : "s, e.g. 24, 26") + '">';
    h += '<label class="f">Color <span class="opt">optional</span></label>' + A.chips("color", D.colors, f.color || "", true);
    h += '<label class="f" for="fQty">' + (edit ? "How many" : "How many of each") + "</label>" + A.stepper("fQty", f.qty != null ? f.qty : 1);
    h += '<details class="more"' + (f.hook || f.bead || f.weight || f.notes ? " open" : "") + "><summary>More details: hook, bead, weight, notes</summary>";
    h += '<div class="row2"><div><label class="f" for="fHook">Hook</label><select id="fHook"><option value="">—</option>';
    for (i = 0; i < D.hookStyles.length; i++) { h += "<option" + (f.hook === D.hookStyles[i] ? " selected" : "") + ">" + D.hookStyles[i] + "</option>"; }
    h += '</select></div><div><label class="f" for="fWeight">Weight</label><select id="fWeight"><option value="">—</option>';
    for (i = 0; i < D.weights.length; i++) { h += "<option" + (f.weight === D.weights[i] ? " selected" : "") + ">" + D.weights[i] + "</option>"; }
    h += '</select></div></div><div class="row2"><div><label class="f" for="fBead">Bead or eyes</label><select id="fBead"><option value="">—</option>';
    for (i = 0; i < D.beads.length; i++) { h += "<option" + (f.bead === D.beads[i] ? " selected" : "") + ">" + D.beads[i] + "</option>"; }
    h += '</select></div><div><label class="f" for="fBeadSize">Bead size</label><input type="text" id="fBeadSize" value="' + esc(f.beadSize || "") + '" placeholder="e.g. 3 mm"></div></div>';
    h += '<label class="f" for="fNotes">Notes</label><input type="text" id="fNotes" value="' + esc(f.notes || "") + '" placeholder="e.g. tied by me, great on the Saluda"></details>';
    h += '<label class="f" for="fPanel">Section</label><select id="fPanel">';
    for (i = 0; i < box.panels.length; i++) {
      h += '<option value="' + box.panels[i].id + '"' + (box.panels[i].id === panel.id ? " selected" : "") + ">" + esc(box.panels[i].name) + "</option>";
    }
    h += "</select>";
    if (edit) {
      h += '<button class="btn block" data-action="save-fly">Save</button>';
      h += '<div class="btn-row"><button class="btn sm light" data-action="dup-fly">Add another size or color</button>' +
        '<button class="btn sm ghost" data-action="move-fly" data-d="-1">Move up</button><button class="btn sm ghost" data-action="move-fly" data-d="1">Move down</button></div>';
      h += '<button class="btn block danger" data-action="delete-fly">Remove this fly</button>';
    } else {
      h += '<button class="btn block" id="addFlyBtn" data-action="save-fly">Add fly</button>';
    }
    return h;
  }

  function addLabel() {
    var btn = document.getElementById("addFlyBtn");
    if (!btn) { return; }
    var n = collectSizes().length;
    btn.textContent = n > 1 ? "Add " + n + " sizes" : "Add fly";
  }
  A.onChange["chip:size"] = addLabel;
  A.onInput.sizeOther = addLabel;

  function collectSizes() {
    var s = A.chipValues("size"), other = A.trim(A.val("fSizeOther"));
    if (other) {
      var parts = other.split(/[,\s]+/);
      for (var i = 0; i < parts.length; i++) { var p = parts[i].replace("#", ""); if (p && s.indexOf(p) < 0) { s.push(p); } }
    }
    s.sort(function (a, b) { return A.sizeRank(a) - A.sizeRank(b); });
    return s;
  }

  function openAdd(box, panelId, prefill) {
    A.openSheet("Add a fly", flyForm(box, panelId, prefill || null, "add"), { box: box.id });
    var o = document.getElementById("fSizeOther");
    if (o) { o.setAttribute("data-action", "sizeOther"); }
  }

  A.actions["add-fly"] = function (el) {
    var b = A.byId(A.state.boxes, el.getAttribute("data-box") || A.sheetCtx.box);
    if (!b) { return; }
    if (!b.panels.length) { b.panels.push({ id: A.uid(), name: "Flies", flies: [] }); }
    openAdd(b, el.getAttribute("data-panel") || A.sheetCtx.panel || b.panels[0].id);
  };
  A.actions["edit-fly"] = function (el) {
    var b = A.byId(A.state.boxes, el.getAttribute("data-box"));
    var hit = b ? A.findFly(b, el.getAttribute("data-fly")) : null;
    if (!hit) { return; }
    A.openSheet("Edit fly", flyForm(b, hit.panel.id, hit.fly, "edit"), { box: b.id, fly: hit.fly.id });
  };

  function readForm() {
    var t = A.chipValues("type")[0] || "nymph", c = A.chipValues("color")[0] || "";
    var q = parseInt(A.val("fQty"), 10);
    return {
      pattern: A.trim(A.val("fPattern")), type: t, color: c, qty: isNaN(q) ? 0 : Math.max(0, q),
      hook: A.val("fHook"), weight: A.val("fWeight"), bead: A.val("fBead"), beadSize: A.trim(A.val("fBeadSize")), notes: A.trim(A.val("fNotes"))
    };
  }
  function sameFly(a, b) {
    return a.type === b.type && String(a.size || "") === String(b.size || "") && (a.color || "") === (b.color || "") &&
      A.trim(a.pattern).toLowerCase() === A.trim(b.pattern).toLowerCase() && (a.bead || "") === (b.bead || "") && (a.hook || "") === (b.hook || "");
  }

  A.actions["save-fly"] = function () {
    var b = A.byId(A.state.boxes, A.sheetCtx.box);
    var data = readForm(), target = A.byId(b.panels, A.val("fPanel")), k, i;
    A.state.prefs.lastType = data.type;
    if (A.sheetCtx.fly) {
      var hit = A.findFly(b, A.sheetCtx.fly);
      var sizes = collectSizes();
      data.size = sizes[0] || "";
      for (k in data) { if (data.hasOwnProperty(k)) { hit.fly[k] = data[k]; } }
      A.touchMax(hit.fly);
      if (hit.panel.id !== target.id) { hit.panel.flies.splice(hit.index, 1); target.flies.push(hit.fly); }
      A.toast("Saved");
    } else {
      var list = collectSizes();
      if (!list.length) { list = [""]; }
      var added = 0, merged = 0;
      for (i = 0; i < list.length; i++) {
        var f = {};
        for (k in data) { if (data.hasOwnProperty(k)) { f[k] = data[k]; } }
        f.size = list[i];
        var existing = null;
        for (var j = 0; j < target.flies.length; j++) { if (sameFly(target.flies[j], f)) { existing = target.flies[j]; } }
        if (existing) { existing.qty += f.qty; A.touchMax(existing); merged++; } else { f.id = A.uid(); A.touchMax(f); target.flies.push(f); added++; }
      }
      var name = A.flyName(data);
      A.toast(list.length > 1 ? "Added " + name + " in " + list.length + " sizes" : (merged ? "Added to your " + name : "Added " + name));
    }
    A.save(); A.closeSheet(); A.rerender();
  };
  A.actions["dup-fly"] = function () {
    var b = A.byId(A.state.boxes, A.sheetCtx.box), hit = A.findFly(b, A.sheetCtx.fly);
    var copy = {}, k;
    for (k in hit.fly) { if (hit.fly.hasOwnProperty(k) && k !== "id" && k !== "size" && k !== "from") { copy[k] = hit.fly[k]; } }
    openAdd(b, hit.panel.id, copy);
  };
  A.actions["move-fly"] = function (el) {
    var b = A.byId(A.state.boxes, A.sheetCtx.box), hit = A.findFly(b, A.sheetCtx.fly);
    var to = hit.index + parseInt(el.getAttribute("data-d"), 10);
    if (to < 0 || to >= hit.panel.flies.length) { return; }
    hit.panel.flies.splice(hit.index, 1);
    hit.panel.flies.splice(to, 0, hit.fly);
    A.save(); A.rerender(); A.toast(to < hit.index ? "Moved up" : "Moved down");
  };
  A.actions["delete-fly"] = function () {
    var b = A.byId(A.state.boxes, A.sheetCtx.box), hit = A.findFly(b, A.sheetCtx.fly);
    hit.panel.flies.splice(hit.index, 1);
    A.save(); A.closeSheet(); A.rerender(); A.toast("Removed");
  };
  A.actions.qty = function (el) {
    var b = A.byId(A.state.boxes, el.getAttribute("data-box")), hit = A.findFly(b, el.getAttribute("data-fly"));
    if (!hit) { return; }
    hit.fly.qty = Math.max(0, (parseInt(hit.fly.qty, 10) || 0) + parseInt(el.getAttribute("data-d"), 10));
    A.touchMax(hit.fly);
    A.save(); A.rerender();
  };

  /* ======================= SECTIONS ======================= */
  A.actions["add-section"] = function (el) {
    A.openSheet("Add a section", '<label class="f" for="pName">Section name</label><input type="text" id="pName" placeholder="e.g. Midges, Shrimp, Poppers">' +
      '<p class="small muted">A section can be one side of a box, a few rows, or a compartment.</p><button class="btn block" data-action="save-section">Add section</button>', { box: el.getAttribute("data-box") });
  };
  A.actions["section-menu"] = function (el) {
    var b = A.byId(A.state.boxes, el.getAttribute("data-box")), p = A.byId(b.panels, el.getAttribute("data-panel"));
    var h = '<label class="f" for="pName">Section name</label><input type="text" id="pName" value="' + esc(p.name) + '">' +
      '<button class="btn block" data-action="save-section">Save name</button>' +
      '<div class="btn-row"><button class="btn sm light" data-action="add-fly">+ Add fly here</button><button class="btn sm ghost" data-action="sort" data-panel="' + p.id + '">Sort this section</button>' +
      '<button class="btn sm ghost" data-action="move-section" data-d="-1">Move up</button><button class="btn sm ghost" data-action="move-section" data-d="1">Move down</button></div>' +
      '<button class="btn block danger" data-action="delete-section">Delete section' + (p.flies.length ? " and its " + A.count(p.flies.length, "entry", "entries") : "") + "</button>";
    A.openSheet("Section", h, { box: b.id, panel: p.id });
  };
  A.actions["save-section"] = function () {
    var b = A.byId(A.state.boxes, A.sheetCtx.box), name = A.trim(A.val("pName"));
    if (!name) { A.toast("Name the section"); return; }
    if (A.sheetCtx.panel) { A.byId(b.panels, A.sheetCtx.panel).name = name; } else { b.panels.push({ id: A.uid(), name: name, flies: [] }); }
    A.save(); A.closeSheet(); A.rerender();
  };
  A.actions["move-section"] = function (el) {
    var b = A.byId(A.state.boxes, A.sheetCtx.box), i = A.indexById(b.panels, A.sheetCtx.panel);
    var to = i + parseInt(el.getAttribute("data-d"), 10);
    if (to < 0 || to >= b.panels.length) { return; }
    var p = b.panels.splice(i, 1)[0];
    b.panels.splice(to, 0, p);
    A.save(); A.closeSheet(); A.rerender();
  };
  A.actions["delete-section"] = function () {
    var b = A.byId(A.state.boxes, A.sheetCtx.box);
    if (b.panels.length <= 1) { A.toast("A box needs at least one section"); return; }
    if (!confirm("Delete this section?")) { return; }
    b.panels.splice(A.indexById(b.panels, A.sheetCtx.panel), 1);
    A.save(); A.closeSheet(); A.rerender();
  };

  /* ======================= SORT (optional) ======================= */
  var SORTS = [
    { id: "size", t: "Size: big to small", s: "2/0, 1/0, 2, 4 … 18, 20" },
    { id: "sizeup", t: "Size: small to big", s: "20, 18 … 2, 1/0, 2/0" },
    { id: "pattern", t: "Pattern, then size", s: "All Pheasant Tails together, big to small" },
    { id: "color", t: "Color: light to dark", s: "Then bright and flashy colors last" },
    { id: "weight", t: "Weight: heavy to light", s: "For nymphs and streamers" }
  ];
  function weightRank(f) { var i = D.weights.indexOf(f.weight); return i < 0 ? -1 : i; }
  function toneRank(f) { var c = A.color(f.color); return c ? c.tone : 2; }
  function nameKey(f) { return A.flyName(f).toLowerCase(); }
  function sortFlies(list, mode) {
    list.sort(function (a, b) {
      var d = 0, ra = A.sizeRank(a.size), rb = A.sizeRank(b.size);
      if (mode === "size") { d = ra - rb; }
      else if (mode === "sizeup") { d = (ra === 999 ? 999 : -ra) - (rb === 999 ? 999 : -rb); }
      else if (mode === "pattern") { d = nameKey(a) < nameKey(b) ? -1 : (nameKey(a) > nameKey(b) ? 1 : ra - rb); }
      else if (mode === "color") { d = toneRank(a) - toneRank(b); }
      else if (mode === "weight") { d = weightRank(b) - weightRank(a); }
      if (d === 0) { d = ra - rb; }
      if (d === 0) { d = nameKey(a) < nameKey(b) ? -1 : (nameKey(a) > nameKey(b) ? 1 : 0); }
      return d;
    });
  }
  A.sortFlies = sortFlies;
  A.actions.sort = function (el) {
    var boxId = el.getAttribute("data-box") || A.sheetCtx.box, panelId = el.getAttribute("data-panel") || "";
    var h = '<p class="small muted">Optional. If you like your current order, just close this. You can also move single flies up or down when you edit them.</p>';
    for (var i = 0; i < SORTS.length; i++) {
      h += '<button class="choice" data-action="do-sort" data-mode="' + SORTS[i].id + '"><b>' + SORTS[i].t + '</b><br><span class="small muted">' + SORTS[i].s + "</span></button>";
    }
    A.openSheet(panelId ? "Sort this section" : "Sort every section", h, { box: boxId, panel: panelId });
  };
  A.actions["do-sort"] = function (el) {
    var b = A.byId(A.state.boxes, A.sheetCtx.box), mode = el.getAttribute("data-mode");
    if (A.sheetCtx.panel) { sortFlies(A.byId(b.panels, A.sheetCtx.panel).flies, mode); }
    else { for (var i = 0; i < b.panels.length; i++) { sortFlies(b.panels[i].flies, mode); } }
    A.save(); A.closeSheet(); A.rerender(); A.toast("Sorted");
  };

  /* ======================= LABELS ======================= */
  function labelText(main, flies) {
    var r = A.sizeRange(flies);
    return main.toUpperCase() + (r && main.indexOf("#") < 0 ? " · " + r : "");
  }
  A.actions.labels = function (el) {
    var b = A.byId(A.state.boxes, el.getAttribute("data-box")), fl = A.boxFlies(b);
    var counts = {}, keys = [], i;
    for (i = 0; i < fl.length; i++) { if (!counts[fl[i].type]) { counts[fl[i].type] = 0; keys.push(fl[i].type); } counts[fl[i].type] += fl[i].qty || 1; }
    keys.sort(function (x, y) { return counts[y] - counts[x]; });
    var names = [];
    for (i = 0; i < keys.length && i < 2; i++) { names.push(A.flyType(keys[i]).name.replace(" & Soft Hackles", "")); }
    var lid = labelText(names.length ? names.join(" · ") : b.name, fl);
    var h = '<p class="small muted">Short labels read best on a real box. Tap one to copy it.</p>';
    h += '<div class="section-label">Lid</div><div class="label-tag" data-action="copy" data-text="' + esc(lid) + '">' + esc(lid) + "</div>";
    h += '<div class="section-label">Sections</div>';
    for (i = 0; i < b.panels.length; i++) {
      var t = labelText(b.panels[i].name, b.panels[i].flies);
      h += '<div class="label-tag" data-action="copy" data-text="' + esc(t) + '">' + esc(t) + "</div>";
    }
    A.openSheet("Label ideas", h);
  };
  A.actions.copy = function (el) {
    var t = el.getAttribute("data-text");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(function () { A.toast("Copied"); }, function () { window.prompt("Copy this label:", t); });
    } else { window.prompt("Copy this label:", t); }
  };

  /* ======================= RESTOCK ======================= */
  A.actions["show-restock"] = function () {
    var low = lowFlies(), h = '<p class="small muted">Flies you\'re out of, or down to your last one. Tap one to update its count.</p><div class="card list-card">';
    for (var i = 0; i < low.length; i++) {
      var f = low[i].fly;
      h += '<div class="fly-row tap" data-action="edit-fly" data-box="' + low[i].box.id + '" data-fly="' + f.id + '">' + A.flyImg(f.type, "row-img") +
        '<div class="row-main"><div><b>' + esc(A.sizeLabel(f.size)) + "</b> " + esc(A.flyName(f)) + '</div><div class="small muted">' + esc(low[i].box.name) + '</div></div><div class="row-qty">' + f.qty + " left</div></div>";
    }
    A.openSheet("Restock list", h + "</div>");
  };

  /* ======================= NEW / EDIT BOX ======================= */
  function defaultSections(kind) {
    if (kind === "puck") { return "Today's flies"; }
    var w = A.state.profile.water;
    if (w === "salt") { return "Baitfish\nShrimp\nCrabs"; }
    if (w === "warm") { return "Poppers\nNymphs\nBuggers"; }
    return "Dries\nNymphs\nStreamers";
  }
  function styleSelect(cur) {
    var h = '<label class="f" for="bStyle">Kind of box <span class="opt">optional</span></label><select id="bStyle"><option value="">Not sure / not set</option>';
    for (var i = 0; i < D.boxStyles.length; i++) {
      h += '<option value="' + D.boxStyles[i].id + '"' + (cur === D.boxStyles[i].id ? " selected" : "") + ">" + esc(D.boxStyles[i].name) + "</option>";
    }
    return h + "</select>";
  }
  function approachSelect(cur) {
    var h = '<label class="f" for="bApproach">Organizing approach</label><select id="bApproach"><option value="">None / my own</option>';
    for (var i = 0; i < D.approaches.length; i++) {
      if (D.approaches[i].dim !== "finish") { h += '<option value="' + D.approaches[i].id + '"' + (cur === D.approaches[i].id ? " selected" : "") + ">" + esc(D.approaches[i].name) + "</option>"; }
    }
    return h + "</select>";
  }
  A.openNewBox = function (kind, styleId) {
    var h = '<label class="f" for="bName">Name</label><input type="text" id="bName" placeholder="' + (kind === "puck" ? "e.g. Saturday creek puck" : "e.g. Trout Box") + '">';
    h += '<label class="f" for="bPanels">Sections <span class="opt">one per line</span></label><textarea id="bPanels">' + defaultSections(kind) + "</textarea>";
    h += '<p class="small muted">Sections are just groups. A section can be a side, a few rows or a compartment, so four sections don\'t need a four-panel box.</p>';
    h += styleSelect(styleId || (kind === "puck" ? "puck" : ""));
    h += '<details class="more"><summary>More options</summary>' + approachSelect("") + "</details>";
    h += '<button class="btn block" data-action="create-box">Create ' + (kind === "puck" ? "day box" : "box") + "</button>";
    A.openSheet(kind === "puck" ? "New day box or puck" : "New fly box", h, { kind: kind });
  };
  A.actions["new-box"] = function (el) { A.openNewBox(el.getAttribute("data-kind") || "box", el.getAttribute("data-style") || ""); };
  A.actions["create-box"] = function () {
    var name = A.trim(A.val("bName"));
    if (!name) { A.toast("Give it a name"); return; }
    var lines = A.val("bPanels").split(/\n/), panels = [];
    for (var i = 0; i < lines.length; i++) { var p = A.trim(lines[i]); if (p) { panels.push({ id: A.uid(), name: p, flies: [] }); } }
    if (!panels.length) { panels.push({ id: A.uid(), name: "Flies", flies: [] }); }
    var b = { id: A.uid(), name: name, kind: A.sheetCtx.kind || "box", approach: A.val("bApproach"), style: A.val("bStyle"), panels: panels, created: Date.now() };
    A.state.boxes.push(b); A.save(); A.closeSheet(); A.go("#box/" + b.id);
  };
  A.actions["edit-box"] = function (el) {
    var b = A.byId(A.state.boxes, el.getAttribute("data-box"));
    var h = '<label class="f" for="bName">Name</label><input type="text" id="bName" value="' + esc(b.name) + '">';
    h += '<label class="f" for="bKind">This is a</label><select id="bKind"><option value="box"' + (b.kind === "box" ? " selected" : "") + '>Fly box</option><option value="puck"' + (b.kind === "puck" ? " selected" : "") + ">Day box or puck</option></select>";
    h += styleSelect(b.style || "") + approachSelect(b.approach || "");
    h += '<button class="btn block" data-action="save-box">Save</button><button class="btn block danger" data-action="delete-box">Delete this box</button>';
    A.openSheet("Edit box", h, { box: b.id });
  };
  A.actions["save-box"] = function () {
    var b = A.byId(A.state.boxes, A.sheetCtx.box), name = A.trim(A.val("bName"));
    if (name) { b.name = name; }
    b.kind = A.val("bKind"); b.style = A.val("bStyle"); b.approach = A.val("bApproach");
    A.save(); A.closeSheet(); A.rerender(); A.toast("Saved");
  };
  A.actions["delete-box"] = function () {
    var b = A.byId(A.state.boxes, A.sheetCtx.box);
    var packed = 0, fl = A.boxFlies(b);
    for (var i = 0; i < fl.length; i++) { if (fl[i].from) { packed++; } }
    if (!confirm('Delete "' + b.name + '"' + (packed ? "? Packed flies will be put back in their boxes first." : " and every fly in it?"))) { return; }
    if (packed && A.unpackBox) { A.unpackBox(b, true); }
    A.state.boxes.splice(A.indexById(A.state.boxes, b.id), 1);
    for (i = 0; i < A.state.trips.length; i++) { if (A.state.trips[i].puckId === b.id) { A.state.trips[i].puckId = null; } }
    A.save(); A.closeSheet(); A.go("#boxes"); A.toast("Deleted");
  };

  /* ======================= ROUTES ======================= */
  A.routes.boxes = { tab: "boxes", render: viewBoxes };
  A.routes.box = { tab: "boxes", render: viewBox };
})();
