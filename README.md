# Angler's Fly Boxes — v001

**Live app:** https://davidfliesen.github.io/anglers-fly-boxes/

An ARTEZIQ progressive web app that teaches fly anglers how to organize their fly boxes. It offers several organizing approaches, helps each angler find the one that fits how they fish, and tracks their own boxes, trip pucks and trips. It works offline once installed.

---

## Features

### Learn
- **Rule #1: start with the forage.** Match flies to what fish eat, where and when.
- **Five organizing systems**, each with an idea, setup steps, an example box layout, pros, watch-outs and who it suits best:
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
- Create fly boxes and trip pucks with custom panels.
- Add flies with pattern name, fly type, hook size (including saltwater sizes like 2/0), color tone and quantity.
- **Sort** any box or panel: largest to smallest, then light → natural → dark → flashy.
- **Label ideas:** suggested lid and panel labels (e.g. "Dry Flies – Trout Box – Size 12-20"), tap to copy.
- **Restock list:** every fly down to 1 or none.
- **Backup:** export and import a JSON file.

### Trips
- Plan a trip by water, target fish and month.
- Season starting points, forage notes, and a prep checklist.
- **Build a trip puck:** pick flies from your boxes and they're copied into a puck, grouped by fly type.
- Ready-to-go kit checklists: Pond Hoppin' Kit, Trout Day Kit, Saltwater Kit.

### Fly Guide
- Ten fly families with how to split them up, common patterns and a storage tip for each.

---

## Project structure

```
index.html              App shell
manifest.webmanifest    PWA manifest
sw.js                   Service worker (offline cache: afb-v001)
css/styles.css          Styles (hardcoded hex colors, no CSS custom properties)
js/data.js              All content: approaches, fly types, quiz, seasons, kits
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
- Content changes (new approaches, fly types, kits, quiz questions) go in `js/data.js`.

## Palette
| Color | Hex | Use |
|---|---|---|
| Seafoam | `#AFE0D2` | Active tab, light buttons, accent cards |
| Teal | `#73ABA5` | Outlines, progress, focus |
| Sand | `#ECCB98` | Card borders, fly box shell |
| Brown | `#987051` | Box trim, panel labels |
| Cream | `#FFEBD2` | Foam panels, header text |
| Deep teal | `#3F7470` | Header, primary buttons |

## Version history
- **v001**: First release. Learn (5 systems + 2 finishing touches), My System quiz, My Boxes (boxes, pucks, sort, labels, restock, backup), Trips (season hints, checklist, trip pucks, kits), Fly Guide.
