# Angler's Fly Boxes — v005

**Live app:** https://davidfliesen.github.io/anglers-fly-boxes/

An ARTEZIQ progressive web app that helps fly anglers organize their fly boxes, find any fly fast, and pack the right flies for each trip. It teaches several organizing approaches for trout, saltwater and warmwater anglers, keeps the setup simple for beginners, and works offline once installed.

---

## What's new in v005
This release reworks the app around what anglers actually do: arrange flies, find them, and pack for a trip.

- **Four tabs:** My Boxes · Trips · Learn · Fly Guide. The quiz (Help me organize) and Box Finder now live inside Learn, with shortcuts from My Boxes.
- **First-run welcome:** new users get two big choices, *Help me organize* and *Add my first box*. Once boxes exist, the app opens to My Boxes.
- **Packing really moves flies.** Packing a day box or puck takes the chosen number out of the source box (move 3 of 8 → 5 stay, 3 go). *Unpack to my boxes* puts back what's left. You pick the count for each fly before packing.
- **Quiz respects the angler.** The first question is the angler's water. Results are a two-part setup: how to arrange your main boxes plus what to take on the water, each with the reason behind it. "Just one box" always gets a one-box result. Examples match the angler's water, and *What shaped this* lists the answers used.
- **Approaches split into two choices.** *How to group your flies* (By Fly Type, By Water & Species, By Hatch & Season) and *What to take on the water* (Main Box + Day Box or Puck, One Box Just the Essentials). Sorting and labels are optional extras.
- **Examples for every water.** Each approach has trout, saltwater and warmwater example layouts with a fly picture in each section, clearly tagged as examples.
- **Fast fly entry:**
  - **+ Add here** on every section picks that section and guesses the fly category from its name (Pheasant Tails → Nymphs, Shrimp → Shrimp & Crabs).
  - **Pattern name is optional.** An unnamed fly shows as "Olive nymph · name unknown".
  - Tap **several hook sizes** to add a pattern in all of them at once.
  - **Real color chips** (olive, brown, black, chartreuse…), a **+/− count**, and a fold-out for hook style, bead or eyes, bead size, weight and notes.
  - **Add another size or color** duplicates a fly; move single flies up or down.
- **Box view and List view.** List view has +/− counts on every row for quick updates.
- **Search** across all boxes by pattern, size, color, bead or section.
- **Sorting is optional,** with five choices (size either way, pattern then size, color, weight) for a section or the whole box. Hook sizes sort correctly through 2/0, 1/0, 2, 4 … 20.
- **Short labels** for real boxes, like `NYMPHS · #14–#18` and `PHEASANT TAILS · #14–#18`.
- **Smarter restock list:** only flies you're out of, or down to one from a bigger count. Anglers who don't track counts never see noise.
- **Box Finder judges physical fit first:** fly size and bulk count double, and results explain *why it fits* (headroom for bushy dries, length for streamers, a seal for salt) before any store links. **"I have one: add it"** sets up a box of that style without shopping. Ties say "Two strong matches."
- **Season tips by water:** trout, saltwater and warmwater starting points, picked by the trip's water (or your profile), clearly labeled as general guidance.
- **Fly Guide** filters by water and explains that category, what a fly imitates, and where it's fished are separate things. Categories are now form-based: Saltwater Patterns became *Shrimp & Crabs*, and Panfish & Bass Bugs became *Poppers & Surface Bugs*.
- **Illustrations** for 10 fly categories and 9 box styles replace the emojis and blank color squares.
- **Wider iPad layout** in landscape, using the full screen width.
- Grammar fixes: "1 box / 3 boxes", "1 section".
- Your v004 boxes, flies and trips carry over automatically. The quiz and Box Finder answers reset once because their questions changed.

---

## Features

### My Boxes
- Boxes and day boxes/pucks with named sections, a box style, and an optional organizing approach.
- Box view (visual sections) and List view (rows with +/− counts).
- Fly entry with category, optional pattern, multi-size batch entry, color, count, and optional hook, bead, weight and notes.
- Search, optional sorting, short label suggestions, restock list, export and import backup.

### Trips
- Plan a trip by kind of water, place, target fish and month.
- Season starting points for that water, notes on what fish are eating, and a prep checklist.
- **Pack a day box or puck:** choose a count of each fly to move from your boxes; unpack when you're home.
- Kit checklists: Pond Hoppin' Kit, Trout Day Kit, Saltwater Kit (your water's kit is listed first).

### Learn
- Start with your water, your fish, and what they eat.
- **Help me organize:** a 5-question quiz with a two-part setup and examples for your water; creates empty boxes on request (never adds flies).
- **Box Finder:** a fit-based quiz and guides for 9 box styles, with "I have one" and "Where to buy".
- Approaches grouped as *How to group your flies*, *What to take on the water*, and *Finishing touches*.

### Fly Guide
- 10 fly categories with pictures, ways to split them, common patterns and a storage tip; filter by trout, saltwater or warmwater.

---

## Affiliate setup
All shop links live in **`js/data.js`** under `shop.retailers`. Each store has three settings:

| Setting | What it does |
|---|---|
| `url` | The store page. `{q}` is replaced with the box style's search words (Amazon uses this). |
| `params` | Text added to the end of the link. For Amazon Associates, put your tracking tag here, e.g. `tag=YOURTAG-20`. |
| `wrap` | For networks that wrap the store link (AvantLink, FlexOffers, etc.). Paste the deep-link format from your network dashboard with `{url}` where the store link goes. |

Leave `params` and `wrap` as `""` until you're approved; the links still work, they just don't earn. After pasting your IDs, bump the version (see *Releasing a new version*) and test a link in a private window.

---

## Replacing the illustrations
The app uses fixed file names, so you can drop in your own art (for example AI-generated images in the style of the logo) without touching code. Use transparent PNGs.

| Folder | Files | Size |
|---|---|---|
| `images/flies/` | `dry`, `emerger`, `nymph`, `streamer`, `terrestrial`, `egg`, `worm`, `attractor`, `popper`, `crustacean` (.png) | 320 × 200, fly facing right |
| `images/boxes/` | `slitfoam`, `silicone`, `compartment`, `magnetic`, `streamer`, `waterproof`, `slimpocket`, `puck`, `boatbox` (.png) | 320 × 240, open box seen from above |

After replacing images, bump the version so installed copies pick them up.

---

## Project structure

```
index.html              App shell (4 tabs)
manifest.webmanifest    PWA manifest
sw.js                   Service worker (network-first app files, offline cache: afb-v005)
css/styles.css          Styles (hardcoded hex colors, no CSS custom properties)
js/data.js              All content: water contexts, fly categories, colors, sizes, approaches with
                        trout/salt/warm layouts, seasons by water, quiz, box styles, Box Finder, kits, shop links
js/app.js               Core: state + migration, helpers, sheets, router, events, updates, backup, About
js/boxes.js             My Boxes: welcome, search, box/list views, fly entry, sections, sort, labels, restock
js/learn.js             Learn: approaches, quiz, Box Finder, box styles, shop sheet, Fly Guide
js/trips.js             Trips: plans, season tips, packing/unpacking day boxes, kits
images/logo-512.png     App logo
images/flies/           10 fly category illustrations
images/boxes/           9 box style illustrations
icons/                  favicon-32, apple-touch-icon (180), icon-192, icon-512, icon-512-maskable
README.md               This file
```

## Tech notes
- Static site for GitHub Pages; no build step, no APIs, no accounts.
- JavaScript is ES5 only (no arrow functions, template literals, let/const or classes). Modules share one `window.AFB` object; `app.js` must load before `boxes.js`, `learn.js` and `trips.js`.
- User data is saved in the browser's `localStorage` (key `afb_state_v1`, data format v2) and never leaves the device unless exported. Older data is upgraded automatically on first load.
- Packed flies remember where they came from (`from: { box, fly }`), which is how *Unpack* returns them.
- **Releasing a new version:** bump `VERSION` in `sw.js` and `version` in `js/data.js`. Installed copies pick it up the next time they're opened or brought back to the foreground online, then show the **Update now** bar. Add any new files to the `ASSETS` list in `sw.js`.
- The service worker registers over HTTPS (and on localhost for testing).

## Palette — Slate & Hot Spot
| Color | Hex | Use |
|---|---|---|
| Slate | `#2F3E4A` | Header, primary buttons, theme color |
| Ink | `#1C262E` | Dark text on light buttons, toasts |
| Steel | `#5E7A8C` | Outlines, progress bars, focus |
| Hot-spot orange | `#E8632B` | Fly box trim, section labels, selected chips, "Add here" |
| Pale orange | `#FFDCC7` | Active tab, light buttons, icon tiles |
| Orange mist | `#FFF1E8` | Accent cards, selected chips |
| Cool gray | `#D5DBE0` | Card borders, fly box shell |
| Foam gray | `#F1F3F5` | Foam panels |
| Page | `#F5F6F7` | App background |
| Text | `#1F2A33` | Body text |

## Version history
- **v005**: Workflow rework from tester feedback: four tabs and first-run welcome; packing moves real counts with unpack; water-aware quiz with a two-part setup; per-water example layouts; fast fly entry (add here, optional pattern, multi-size, colors, details); box and list views; search; optional sorting; short labels; smarter restock; fit-based Box Finder with "I have one"; season tips by water; form-based fly categories; illustrations; wide iPad layout.
- **v004**: Network-first service worker, fresh downloads on install, foreground update checks, Update now bar, Check for updates button.
- **v003**: Slate & Hot Spot color palette across the whole app.
- **v002**: Box Finder tab, nine box style guides, affiliate-ready shop links with disclosure, box style setting in My Boxes, six-tab navigation.
- **v001**: First release: Learn, My System quiz, My Boxes, Trips, Fly Guide.
