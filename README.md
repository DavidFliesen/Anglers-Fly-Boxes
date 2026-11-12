# Angler's Fly Boxes — v003

**Live app:** https://davidfliesen.github.io/anglers-fly-boxes/

An ARTEZIQ progressive web app that teaches fly anglers how to organize their fly boxes. It offers several organizing approaches, helps each angler find the one that fits how they fish, recommends the right kind of physical fly box with shop links, and tracks their own boxes, trip pucks and trips. It works offline once installed.

---

## What's new in v003
- **New color palette: Slate & Hot Spot.** Cool slate and gray-foam tones with hot-orange accents, like the hot spot on a nymph.
- Header, buttons, tabs, cards, fly box shells, foam panels and pucks all use the new colors.
- Browser and home-screen theme color updated to slate.

## Added in v002
- **Box Finder tab:** five questions match the angler to the right kind of fly box, with a best match, a runner-up and a "pair it with" accessory.
- **Nine box style guides** with pros, watch-outs, tips and the organizing systems each suits.
- **Where to buy** links to Amazon, Trident Fly Fishing, RiverBum and Orvis, ready for affiliate IDs, with a disclosure.
- Physical box style setting in My Boxes; six-tab navigation.

---

## Features

### Learn
- **Rule #1: start with the forage.** Match flies to what fish eat, where and when.
- **Five organizing systems**, each with an idea, setup steps, an example box layout, pros, watch-outs, who it suits best, and the box styles that fit it:
  - By Fly Type
  - By Water & Species
  - All-Around Box + Trip Pucks
  - Match the Hatch & Season
  - Forage-First Minimalist
- **Two finishing touches** that work with any system: Size & Color Order, and Label Everything.
- **Set up these boxes:** one tap builds the example layout as editable boxes in My Boxes.

### My System (quiz)
- Five quick questions score every system and recommend a best fit and a runner-up, with reasons.

### My Boxes
- Create fly boxes and trip pucks with custom panels and a physical box style.
- Add flies with pattern name, fly type, hook size (including saltwater sizes like 2/0), color tone and quantity.
- **Sort** any box or panel: largest to smallest, then light → natural → dark → flashy.
- **Label ideas:** suggested lid and panel labels, tap to copy.
- **Restock list:** every fly down to 1 or none.
- **Backup:** export and import a JSON file.

### Box Finder
- Questions: what the box holds, how it's carried, how wet it gets, how many flies, and what matters most.
- Results with shop buttons, plus a browsable list of all nine box styles.

### Trips
- Plan a trip by water, target fish and month.
- Season starting points, forage notes, and a prep checklist.
- **Build a trip puck:** pick flies from your boxes and they're copied into a puck, grouped by fly type.
- Ready-to-go kit checklists: Pond Hoppin' Kit, Trout Day Kit, Saltwater Kit.

### Fly Guide
- Ten fly families with how to split them up, common patterns and a storage tip for each.

---

## Affiliate setup

All shop links live in **`js/data.js`** under `shop.retailers`. Each store has three settings:

| Setting | What it does |
|---|---|
| `url` | The store page. `{q}` is replaced with the box style's search words (Amazon uses this). |
| `params` | Text added to the end of the link. For Amazon Associates, put your tracking tag here, e.g. `tag=YOURTAG-20`. |
| `wrap` | For networks that wrap the store link (AvantLink, FlexOffers, etc.). Paste the deep-link format from your network dashboard with `{url}` where the store link goes. |

Leave `params` and `wrap` as `""` until you're approved; the links still work, they just don't earn.

**Steps after approval**
1. Copy the tracking tag or deep-link format exactly as your network's dashboard shows it.
2. Paste it into that store's `params` or `wrap` in `js/data.js`.
3. Bump the version, then bump `CACHE` in `sw.js` so installed copies download the new links.
4. Test a link in a private browser window and confirm the click appears in your network report.

**Adding a store:** copy an existing retailer entry and change `id`, `name`, `note` and `url`. Use a fly-box category page or a search link the store supports.

Shop links open in a new tab with `rel="sponsored noopener"`, and the disclosure text is set in `shop.disclosure`.

---

## Project structure

```
index.html              App shell
manifest.webmanifest    PWA manifest
sw.js                   Service worker (offline cache: afb-v003)
css/styles.css          Styles (hardcoded hex colors, no CSS custom properties)
js/data.js              All content: approaches, fly types, quiz, seasons, kits, box styles, Box Finder, shop links
js/app.js               App logic (ES5 only)
images/logo-512.png     App logo
icons/                  favicon-32, apple-touch-icon (180), icon-192, icon-512, icon-512-maskable
README.md               This file
```

## Tech notes
- Static site for GitHub Pages; no build step, no APIs, no accounts.
- JavaScript is ES5 only (no arrow functions, template literals, let/const or classes).
- User data is saved in the browser's `localStorage` (key `afb_state_v1`) and never leaves the device unless exported.
- The service worker registers only over HTTPS. Bump `CACHE` in `sw.js` with each version so devices pick up new files.
- Content changes go in `js/data.js`.

## Palette — Slate & Hot Spot
| Color | Hex | Use |
|---|---|---|
| Slate | `#2F3E4A` | Header, primary buttons, theme color |
| Ink | `#1C262E` | Dark text on light buttons, toasts |
| Steel | `#5E7A8C` | Outlines, progress bars, focus |
| Hot-spot orange | `#E8632B` | Fly box trim, panel and section labels |
| Pale orange | `#FFDCC7` | Active tab, light buttons, icon tiles |
| Orange mist | `#FFF1E8` | Accent cards |
| Cool gray | `#D5DBE0` | Card borders, fly box shell |
| Foam gray | `#F1F3F5` | Foam panels, header text |
| Page | `#F5F6F7` | App background |
| Text | `#1F2A33` | Body text |

## Version history
- **v003**: New Slate & Hot Spot color palette across the whole app.
- **v002**: Box Finder tab, nine box style guides, affiliate-ready shop links with disclosure, box styles linked to organizing systems, box style setting in My Boxes, six-tab navigation.
- **v001**: First release. Learn (5 systems + 2 finishing touches), My System quiz, My Boxes (boxes, pucks, sort, labels, restock, backup), Trips (season hints, checklist, trip pucks, kits), Fly Guide.
