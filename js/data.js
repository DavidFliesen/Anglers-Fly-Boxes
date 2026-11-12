/* Angler's Fly Boxes - content data (ES5) */
var AFB_DATA = {

  version: "v004",

  /* ---------------- ORGANIZING APPROACHES ---------------- */
  approaches: [
    {
      id: "type",
      boxes: ["slimpocket", "slitfoam", "compartment", "streamer"],
      name: "By Fly Type",
      group: "system",
      icon: "🗂️",
      short: "A box (or panel) for each kind of fly: dries, nymphs, streamers and so on.",
      idea: "This is the classic starting point. Every fly goes where its category lives, so you always know which box holds your dries and which holds your nymphs. Inside each box you can split things further by the insect or job the fly imitates.",
      steps: [
        "Dump every fly out and sort them into piles by type: dries, nymphs, emergers, streamers, terrestrials, and eggs/worms/attractors.",
        "Give each pile its own box, or its own panel in a big multi-panel box.",
        "Subdivide inside each box: dries by mayfly, caddis and stonefly; nymphs by pattern; streamers by baitfish, leeches and buggers.",
        "Within every row, finish with size and color order (see that card).",
        "Label the outside of each box so you can grab it without opening it."
      ],
      layout: [
        { name: "Dry Fly Box", panels: ["Mayflies", "Caddisflies", "Stoneflies", "Terrestrials"] },
        { name: "Nymph Box", panels: ["Pheasant Tails", "Hare's Ears", "Midges", "Jig / Euro Nymphs"] },
        { name: "Streamer Box", panels: ["Baitfish", "Leeches", "Buggers"] },
        { name: "Specialty Box", panels: ["Emergers", "Eggs", "Worms", "Attractors"] }
      ],
      pros: [
        "Easy to learn: great for building your fly vocabulary.",
        "You always know where a category lives.",
        "Works well for home storage and restocking."
      ],
      cons: [
        "You can end up carrying a lot of boxes.",
        "On the water you may dig through several boxes to rig one setup.",
        "Doesn't tell you which flies to bring for a given water."
      ],
      best: "Newer anglers, fly tyers, and anyone organizing their master collection at home."
    },
    {
      id: "water",
      boxes: ["waterproof", "streamer", "compartment", "boatbox"],
      name: "By Water & Species",
      group: "system",
      icon: "🌊",
      short: "Each box is built for a place and a fish: trout stream, beach, grass flats, farm pond.",
      idea: "Instead of sorting by what a fly is, sort by where you will use it. A trout box, a saltwater box and a pond box each hold every type of fly that water calls for. Grab the right box and you are done packing.",
      steps: [
        "List the kinds of water you actually fish and the fish you target in each.",
        "Make one box per water: for example Trout Stream, Saltwater Open Water/Beach, Saltwater Grass Flats, and Ponds.",
        "Fill each box with the forage that water holds: baitfish patterns for the beach, crab and shrimp patterns for the grass, small poppers and nymphs for bluegill.",
        "It's fine to repeat a pattern in more than one box. Fish don't know what a fly was 'meant' for.",
        "Keep a small kit with each box (spare tippet, nippers or hemostats) so it's grab-and-go."
      ],
      layout: [
        { name: "Trout Stream Box", panels: ["Nymphs", "Dries", "Small Streamers & Attractors", "Euro & Misc"] },
        { name: "Salt: Open Water & Beach", panels: ["Clouser Minnows", "Surf Candy", "Bucktail Baitfish"] },
        { name: "Salt: Grass Flats", panels: ["Crab Patterns", "Shrimp Patterns"] },
        { name: "Pond Hoppin' Box", panels: ["Bluegill", "Bass"] }
      ],
      pros: [
        "One box per trip: fast to pack and fewer boxes on the water.",
        "Every box is tuned to the forage in that water.",
        "Pairs naturally with ready-to-go kits."
      ],
      cons: [
        "Some patterns get duplicated across boxes.",
        "You may own more boxes overall.",
        "New waters need a new box or a careful mix."
      ],
      best: "Anglers who fish several very different waters, like trout streams, saltwater and ponds."
    },
    {
      id: "puck",
      boxes: ["silicone", "puck", "magnetic"],
      name: "All-Around Box + Trip Pucks",
      group: "system",
      icon: "🧰",
      short: "One do-everything box that always comes along, plus small pucks with just the flies for today's water.",
      idea: "Carry one well-organized, multi-panel box that covers most situations. Then, before a trip, load a small fly puck with only the handful of patterns you expect to use on that specific water. You fish mostly out of the puck and still have the big box as backup.",
      steps: [
        "Pick one good-sized box with several panels, for example: Nymphs, Dries, Small Streamers & Attractors, and Euro & Misc.",
        "Stock it with your most reliable patterns in a range of sizes.",
        "Before each trip, decide what the fish are likely eating on that water.",
        "Load a puck with just those patterns. For a small creek that might be only two: a bright attractor nymph and an egg.",
        "Fish from the puck; restock the all-around box when you get home."
      ],
      layout: [
        { name: "All-Around Trout Box", panels: ["Nymphs", "Dries", "Small Streamers & Attractors", "Euro & Misc"] },
        { name: "Trip Puck: Small Creek", panels: ["Attractor Nymph", "Egg"], kind: "puck" }
      ],
      pros: [
        "You're always covered, but you fish light.",
        "Fly changes are fast because the puck holds only a few choices.",
        "Easy to adapt as your gear and habits evolve."
      ],
      cons: [
        "Needs a few minutes of planning before each trip.",
        "Pucks hold only a handful of flies.",
        "Works best once you know your waters."
      ],
      best: "Trout anglers with a home water or two, and anyone tired of carrying a pile of boxes."
    },
    {
      id: "hatch",
      boxes: ["slimpocket", "compartment", "silicone"],
      name: "Match the Hatch & Season",
      group: "system",
      icon: "📅",
      short: "Build boxes around what's hatching or what fish are eating at that time of year.",
      idea: "Fish key on whatever food is most available at that place and time. If you only carry what's likely to be on the menu, you carry less and choose faster. Hatch charts for your destination tell you which insects show up in which months.",
      steps: [
        "Look up a hatch chart for the water (or the general area) you plan to fish.",
        "Note which insects and life stages show up that month, and their sizes and colors.",
        "Pack those patterns: dries for the adults, emergers for the transition, nymphs for the immature stage.",
        "Add seasonal staples: terrestrials in summer, midges in winter, egg patterns around spawning time, streamers in fall.",
        "No hatch chart? Learn the forage: what lives in that water and what falls into it."
      ],
      layout: [
        { name: "Spring Hatch Box", panels: ["Mayfly Nymphs", "Mayfly Emergers", "Mayfly Dries", "Caddis"] },
        { name: "Summer Terrestrials", panels: ["Hoppers", "Ants", "Beetles", "Crickets"] },
        { name: "Fall Streamers", panels: ["Baitfish", "Leeches", "Buggers"] },
        { name: "Winter Midges & Eggs", panels: ["Midge Larvae", "Midge Pupae", "Midge Adults", "Eggs"] }
      ],
      pros: [
        "You carry fewer flies with more confidence.",
        "Teaches you the life cycle of the insects fish eat.",
        "Seasonal boxes rotate easily through the year."
      ],
      cons: [
        "Requires a little research before each trip.",
        "Hatch charts don't exist for every water.",
        "Unexpected hatches can catch you short."
      ],
      best: "Trout anglers who time trips to hatches, and anyone who likes the 'why' behind fly choice."
    },
    {
      id: "forage",
      boxes: ["silicone", "slimpocket"],
      name: "Forage-First Minimalist",
      group: "system",
      icon: "🎯",
      short: "Learn what the fish eat where you fish, then carry just a few proven patterns in a couple of sizes.",
      idea: "Choosing flies gets simple once you know the forage: what's in the water, at what time of year, and in what sizes. Many anglers carry far more flies than they ever use. A minimalist box holds a few patterns that cover the most common food, plus a couple of wild cards.",
      steps: [
        "For each water, learn the main forage: insects, baitfish, crustaceans, and what falls in from land.",
        "If one dry fly style covers the local hatch (for example a tan or black elk hair caddis), carry it in two sizes and skip the rest.",
        "Carry more of what is always present. On many streams that means terrestrials for much of the year.",
        "Include a few weights: lightly weighted flies save the day in low, clear water.",
        "Keep one or two wild cards. A tiny baitfish pattern meant for panfish can still fool a trout."
      ],
      layout: [
        { name: "Minimalist Stream Box", panels: ["Caddis Dries (2 sizes)", "Terrestrials", "Nymphs & Soft Hackles", "Streamers & Wild Cards"] }
      ],
      pros: [
        "The lightest, simplest system to carry.",
        "Decisions are quick, so you spend more time fishing.",
        "Builds real knowledge of your waters."
      ],
      cons: [
        "Fewer backups if fish get picky.",
        "Takes time on the water to learn the forage.",
        "Less suited to fishing many new places."
      ],
      best: "Anglers who fish a few familiar waters, wade light, or want to stop over-packing."
    },
    {
      id: "order",
      boxes: ["silicone", "slitfoam"],
      name: "Size & Color Order",
      group: "finish",
      icon: "↕️",
      short: "Inside any box: largest to smallest, then light to dark (or natural to flashy).",
      idea: "This isn't a whole system. It's the finishing layer that makes any system faster. When every row runs the same way, your eye finds the right size and shade in seconds, even in poor light.",
      steps: [
        "Within each fly type or pattern, line flies up from largest hook to smallest (hook size 8 before 18).",
        "Then order by color: light to dark, or natural to flashy.",
        "Keep the same direction in every box so it becomes muscle memory.",
        "Leave a gap at the end of each row for new flies.",
        "In this app, the Sort button in My Boxes does this for you."
      ],
      layout: [
        { name: "Any Box", panels: ["Large → Small", "Light → Dark", "Natural → Flashy"] }
      ],
      pros: ["Works with every other approach.", "Fast choices for water clarity and light.", "Easy to spot gaps to restock."],
      cons: ["Takes a little upkeep after each trip."],
      best: "Everyone. Add it to whatever system you choose."
    },
    {
      id: "label",
      boxes: ["slimpocket", "waterproof"],
      name: "Label Everything",
      group: "finish",
      icon: "🏷️",
      short: "Waterproof labels on the outside of each box so you grab the right one without opening it.",
      idea: "A label that names the type, the target and the size range turns a stack of identical boxes into a system. It also helps a fishing partner find the right fly when you hand them a box.",
      steps: [
        "Use waterproof labels or a paint pen on the lid and edge of each box.",
        "Name the contents, the target and the size range, for example 'Dry Flies - Trout - Size 12-20'.",
        "Other examples: 'Steelhead - Egg Patterns' or 'Saltwater - Shrimp/Crabs'.",
        "Color-code if you like: one color for fresh, one for salt.",
        "Update the label when a box changes jobs. My Boxes can suggest labels for you."
      ],
      layout: [
        { name: "Label Examples", panels: ["Dry Flies – Trout – 12-20", "Steelhead – Egg Patterns", "Saltwater – Shrimp/Crabs"] }
      ],
      pros: ["Instant box identification.", "Great when you own several similar boxes."],
      cons: ["Labels need updating as boxes evolve."],
      best: "Anyone with more than two boxes."
    }
  ],

  /* ---------------- FLY TYPES ---------------- */
  flyTypes: [
    { id: "dry", name: "Dry Flies", color: "#ECCB98",
      blurb: "Float on the surface and imitate adult insects. Use them when fish are rising and feeding on top.",
      subs: ["Mayflies", "Caddisflies", "Stoneflies"],
      examples: ["Elk Hair Caddis", "Parachute dun", "Blue-Winged Olive", "Stimulator-style stonefly"],
      tip: "Store dries in a box with room so hackles don't get crushed." },
    { id: "nymph", name: "Nymphs", color: "#987051",
      blurb: "Imitate immature aquatic insects. Trout eat most of their food below the surface, which makes nymphs some of the most productive flies there are.",
      subs: ["Pheasant Tails", "Hare's Ears", "Midges", "Jig / Euro"],
      examples: ["Pheasant Tail", "Hare's Ear", "Zebra Midge", "Perdigon"],
      tip: "Sort by weight as well as size: bead color or a dot on the slot helps." },
    { id: "emerger", name: "Emergers", color: "#AFE0D2",
      blurb: "Imitate insects changing from nymph to adult, usually just under the surface. During a hatch, fish often prefer these easy targets.",
      subs: ["Mayfly emergers", "Caddis pupae", "Midge emergers"],
      examples: ["Soft hackle", "CDC emerger", "Sparkle pupa"],
      tip: "Keep emergers next to the matching dries so you can switch fast mid-hatch." },
    { id: "streamer", name: "Streamers", color: "#73ABA5",
      blurb: "Bigger flies stripped or swung to imitate prey. Deadly when fish feed aggressively, such as in fall before winter.",
      subs: ["Baitfish", "Leeches", "Buggers"],
      examples: ["Woolly Bugger", "Bucktail baitfish", "Clouser Minnow", "Leech"],
      tip: "Give streamers a deep box or wallet so tails and hooks don't tangle." },
    { id: "terrestrial", name: "Terrestrials", color: "#C9A26A",
      blurb: "Land insects such as ants, beetles, grasshoppers and crickets that fall into the water and become an easy meal.",
      subs: ["Hoppers", "Ants", "Beetles", "Crickets"],
      examples: ["Foam hopper", "Foam beetle", "Parachute ant"],
      tip: "A summer box of terrestrials covers a lot of water from July to September." },
    { id: "egg", name: "Egg Patterns", color: "#EE8A6A",
      blurb: "Imitate fish eggs, a natural food for trout and steelhead around spawning time. Often tied from yarn; orange and pink are favorites.",
      subs: ["Single eggs", "Clusters", "Beaded eggs"],
      examples: ["Glo Bug yarn egg", "Nuke egg", "Bead egg"],
      tip: "Group eggs by color shade so you can match what's in the drift." },
    { id: "worm", name: "Worms", color: "#D97A6C",
      blurb: "Imitate real worms, a high-protein food that's especially available after rain raises the water.",
      subs: ["San Juan style", "Squirmy style", "Mop style"],
      examples: ["San Juan Worm", "Squirmy worm"],
      tip: "Keep a few after storms; high, off-color water is worm time." },
    { id: "attractor", name: "Attractors", color: "#F4B95C",
      blurb: "Built to grab attention with bright color and exaggerated movement rather than copy one specific food.",
      subs: ["Flashy nymphs", "Bright dries", "Hot-spot flies"],
      examples: ["Hot-spot nymph", "Flashback nymph", "Bright foam dry"],
      tip: "Great for searching new water or when nothing is hatching." },
    { id: "salt", name: "Saltwater Patterns", color: "#4F8E88",
      blurb: "Baitfish, crab and shrimp imitations built on corrosion-resistant hooks.",
      subs: ["Baitfish", "Crabs", "Shrimp"],
      examples: ["Clouser Minnow", "Surf Candy", "Crab pattern", "Shrimp pattern"],
      tip: "Rinse salt boxes with fresh water and dry them open after every trip." },
    { id: "warm", name: "Panfish & Bass Bugs", color: "#7E8652",
      blurb: "Poppers, sliders and small bugs for ponds and lakes.",
      subs: ["Poppers", "Sliders", "Small nymphs & spiders"],
      examples: ["Foam popper", "Rubber-leg spider", "Small bugger"],
      tip: "A small pond box and a spool of tippet is all you need to walk ponds." }
  ],

  colorTones: ["Light", "Natural", "Dark", "Flashy"],

  /* ---------------- SEASON HINTS (by month index 0-11) ---------------- */
  seasons: [
    { months: [11, 0, 1], name: "Winter", hints: ["Midges in every stage: larvae, pupae and tiny adults.", "Small nymphs fished slow and deep.", "Egg patterns where trout or steelhead are spawning."] },
    { months: [2, 3, 4], name: "Spring", hints: ["Mayfly and caddis hatches start; check the hatch chart.", "Carry nymphs, emergers and dries for the same insect.", "Worms after spring rains raise the water."] },
    { months: [5, 6, 7], name: "Summer", hints: ["Terrestrials: hoppers, ants and beetles.", "Early and late caddis and mayfly activity.", "Lightly weighted flies for low, clear water."] },
    { months: [8, 9, 10], name: "Fall", hints: ["Streamers: fish feed hard before winter.", "Egg patterns around fall spawning runs.", "Late terrestrials and small mayflies on warm days."] }
  ],

  /* ---------------- QUIZ ---------------- */
  quiz: [
    { id: "where", q: "Where do you fish most?", a: [
      { t: "Trout streams", s: { puck: 2, hatch: 2, type: 1 }, why: { puck: "trout streams reward a solid all-around box", hatch: "trout key on hatches" } },
      { t: "Saltwater", s: { water: 3, type: 1 }, why: { water: "beach and grass flats need different forage" } },
      { t: "Ponds & lakes", s: { water: 2, forage: 2 }, why: { water: "a dedicated pond box keeps it simple", forage: "pond forage is easy to learn" } },
      { t: "A mix of everything", s: { water: 3, puck: 1 }, why: { water: "you fish very different waters" } } ] },
    { id: "boxes", q: "How many boxes do you want to carry on the water?", a: [
      { t: "Just one", s: { puck: 3, forage: 2 }, why: { puck: "you want one box plus a light puck", forage: "you like to travel light" } },
      { t: "Two or three", s: { water: 2, hatch: 1, puck: 1 }, why: { water: "a box per water fits two or three" } },
      { t: "I don't mind several", s: { type: 3, water: 1 }, why: { type: "you're fine carrying a box per fly type" } } ] },
    { id: "plan", q: "Do you plan trips around a specific water or hatch?", a: [
      { t: "Yes, usually", s: { hatch: 3, puck: 2 }, why: { hatch: "you already plan around hatches", puck: "planning makes trip pucks easy" } },
      { t: "Sometimes", s: { puck: 2, water: 1 }, why: { puck: "a puck covers the trips you do plan" } },
      { t: "Rarely, I just go", s: { water: 2, type: 1, puck: 1 }, why: { water: "grab-and-go boxes suit spur-of-the-moment trips" } } ] },
    { id: "exp", q: "How long have you been fly fishing?", a: [
      { t: "I'm new", s: { type: 3, forage: 1 }, why: { type: "sorting by type teaches you the fly families" } },
      { t: "A few seasons", s: { puck: 1, water: 1, hatch: 1 }, why: {} },
      { t: "Many years", s: { hatch: 2, forage: 2 }, why: { hatch: "experience makes matching the hatch pay off", forage: "you know your waters' forage" } } ] },
    { id: "pain", q: "What frustrates you most?", a: [
      { t: "I can't find the fly I want", s: { type: 2 }, why: { type: "clear categories make flies easy to find" }, tip: "order" },
      { t: "I carry too much", s: { forage: 3, puck: 2 }, why: { forage: "a minimalist box cuts the weight", puck: "a puck lets the big box stay in the pack" } },
      { t: "I don't know which flies to bring", s: { hatch: 3, forage: 2 }, why: { hatch: "hatch charts tell you what to bring", forage: "learning the forage answers that question" } },
      { t: "I run out of the right fly", s: { water: 1, puck: 1 }, why: {}, tip: "restock" } ] }
  ],

  /* ---------------- KITS ---------------- */
  kits: [
    { id: "pond", name: "Pond Hoppin' Kit", note: "Walk the ponds and pick at bluegill and bass.",
      items: ["Pond box (bluegill & bass flies)", "Spool of 10 lb mono", "Spool of 3X tippet", "Hemostats / cutters", "Rod & reel"] },
    { id: "trout", name: "Trout Day Kit", note: "Your all-around box plus a puck for today's water.",
      items: ["All-around trout box", "Trip puck for today's water", "Tippet: 4X-6X", "Nippers & forceps", "Floatant & indicators", "Split shot"] },
    { id: "salt", name: "Saltwater Kit", note: "Pick the box for open water or the grass.",
      items: ["Open water / beach box", "Grass flats box (crab & shrimp)", "Fluorocarbon leader material", "Pliers", "Stripping guards", "Fresh-water rinse when home"] }
  ],

  tripChecklist: [
    "Check the hatch chart for this water and month",
    "Note the main forage (insects, baitfish, crustaceans, terrestrials)",
    "Pick patterns that match the forage's size and color",
    "Build a trip puck with just those patterns",
    "Bring a couple of lighter-weighted flies for low, clear water",
    "Restock any flies running low",
    "Pack tippet, nippers and hemostats"
  ],

  /* ---------------- BOX STYLES (physical fly boxes) ---------------- */
  boxStyles: [
    { id: "slitfoam", name: "Slit Foam Box", icon: "\uD83D\uDCE6", q: "slit foam fly box",
      short: "Rows of slit foam that grip each hook. The classic all-purpose fly box.",
      holds: "Nymphs, wet flies, small dries and small streamers.",
      pros: ["Affordable and easy to find", "High capacity, often double-sided", "Clean rows make size & color order easy"],
      cons: ["Foam tears and wears out over the years", "Low foam ridges can crush bushy dry flies"],
      tip: "Choose tall foam ridges if you'll keep dries in it." },
    { id: "silicone", name: "Silicone Slot Box", icon: "\uD83D\uDD12", q: "silicone fly box",
      short: "Slotted silicone or rubber that grips hooks tight and doesn't wear out like foam.",
      holds: "Nymphs, jig and euro flies, dries and small streamers.",
      pros: ["Lasts far longer than foam", "Flies stay put, even if the box is dropped", "Usually slim and easy to pocket"],
      cons: ["Costs more than foam boxes", "Slots suit a range of hook sizes, not every size"],
      tip: "A great 'buy once' upgrade for your all-around box." },
    { id: "compartment", name: "Compartment Box", icon: "\uD83E\uDDF1", q: "compartment fly box",
      short: "Open cells (sometimes with flip lids) that let flies sit loose without being squashed.",
      holds: "Bushy dries, hoppers and other terrestrials, poppers, and tiny midges.",
      pros: ["Never crushes hackle or foam", "Holds lots of bulky flies", "Cells make natural groups by pattern or size"],
      cons: ["Flies can blow out when you open it in the wind", "Harder to see one size at a glance"],
      tip: "Clear lids let you find the right cell before you open it." },
    { id: "magnetic", name: "Magnetic Box", icon: "\uD83E\uDDF2", q: "magnetic fly box",
      short: "A magnetic base or pad holds hooks, so you can drop a fly in and close the lid.",
      holds: "Nymphs, midges, soft hackles and small streamers.",
      pros: ["Fastest fly changes there are", "Nothing to poke or tear", "Great for tiny flies that are hard to pin"],
      cons: ["Flies can slide around if the box gets shaken", "Not for big, bushy flies"],
      tip: "Pair with a slot box for flies you want held in exact rows." },
    { id: "streamer", name: "Streamer Box or Wallet", icon: "\uD83D\uDC1F", q: "streamer fly box",
      short: "A deep box with tall foam bars, or a wallet with fleece pages, made for long flies.",
      holds: "Streamers, buggers, leeches and saltwater baitfish patterns.",
      pros: ["Tails and wings stay straight", "Big hooks are held securely", "Wallets pack flat in a bag"],
      cons: ["Bulky in a pocket", "Wallets don't protect flies from crushing"],
      tip: "Let wet streamers dry before closing the box to protect hooks and materials." },
    { id: "waterproof", name: "Waterproof Box", icon: "\uD83D\uDCA7", q: "waterproof fly box",
      short: "A gasket-sealed box that keeps water out. Most float if you drop them.",
      holds: "Saltwater flies and anything that rides in a kayak, boat or wet sling.",
      pros: ["Keeps salt spray and rain off your flies", "Usually floats", "Tough shells survive drops"],
      cons: ["Thicker and heavier", "Wet flies sealed inside will rust: dry them first"],
      tip: "Rinse with fresh water and dry it open after every saltwater trip." },
    { id: "slimpocket", name: "Slim Pocket Box", icon: "\uD83D\uDCD2", q: "slim fly box",
      short: "Low-profile, single-leaf boxes that stack in a shirt or vest pocket.",
      holds: "Nymphs, wet flies, midges and small dries.",
      pros: ["Carry several boxes without the bulk", "Perfect for organizing one box per fly type", "Light and inexpensive"],
      cons: ["Small capacity per box", "Too thin for bushy flies"],
      tip: "Use a different color for each type so you grab the right one by feel." },
    { id: "puck", name: "Fly Puck", icon: "\u25CF", q: "fly puck",
      short: "A small round case that holds a handful of flies for one trip or one water.",
      holds: "The few patterns you expect to use today.",
      pros: ["Fits anywhere: pocket, lanyard or pack strap", "Forces you to carry only what matters", "Cheap enough to own several"],
      cons: ["Holds only a few flies", "Not a home for your whole collection"],
      tip: "Build one per home water and leave them loaded." },
    { id: "boatbox", name: "Boat Box / Bulk Storage", icon: "\uD83D\uDEA4", q: "boat fly box",
      short: "A large compartment box with a handle, made for drift boats and restocking at home.",
      holds: "Your whole collection: dozens of each pattern.",
      pros: ["Massive capacity", "Easy to restock your on-water boxes from it", "Big handles and lids"],
      cons: ["Not for wading", "Takes up space"],
      tip: "Organize it the same way as your on-water boxes so restocking is quick." }
  ],

  accessories: [
    { id: "patch", name: "Fly Drying Patch", icon: "\uD83E\uDDF7", q: "fly drying patch",
      short: "A clip-on foam, fleece or magnetic patch that holds used flies until they dry, so wet flies don't rust in your box." }
  ],

  boxFinder: [
    { id: "holds", q: "What will this box mostly hold?", a: [
      { t: "Dry flies & terrestrials", s: { compartment: 3, slitfoam: 1, silicone: 1 } },
      { t: "Nymphs & euro flies", s: { silicone: 3, slitfoam: 2, magnetic: 2, slimpocket: 1 } },
      { t: "Streamers & baitfish", s: { streamer: 4, waterproof: 1 } },
      { t: "Saltwater flies", s: { waterproof: 3, streamer: 2, silicone: 1 } },
      { t: "Poppers & pond bugs", s: { compartment: 3, boatbox: 1 } },
      { t: "A little of everything", s: { slitfoam: 2, silicone: 2, waterproof: 1 } } ] },
    { id: "carry", q: "How will you carry it?", a: [
      { t: "Shirt or vest pocket", s: { slimpocket: 3, magnetic: 1, puck: 1, silicone: 1 } },
      { t: "Chest pack or sling", s: { silicone: 2, slitfoam: 2, waterproof: 1 } },
      { t: "Backpack", s: { streamer: 1, waterproof: 1, slitfoam: 1 } },
      { t: "Boat or kayak", s: { boatbox: 3, waterproof: 2 } },
      { t: "It stays at home", s: { boatbox: 3, compartment: 1 } } ] },
    { id: "wet", q: "How wet does it get?", a: [
      { t: "Mostly stays dry", s: {} },
      { t: "Rain, splashes and wading", s: { waterproof: 1, silicone: 1 } },
      { t: "Saltwater, or it could go overboard", s: { waterproof: 3 } } ] },
    { id: "count", q: "How many flies will it hold?", a: [
      { t: "A handful for one trip", s: { puck: 4, slimpocket: 1 } },
      { t: "About 30 to 100", s: { slimpocket: 1, silicone: 1, magnetic: 1 } },
      { t: "About 100 to 300", s: { slitfoam: 2, silicone: 1, waterproof: 1 } },
      { t: "Hundreds", s: { boatbox: 3 } } ] },
    { id: "matters", q: "What matters most to you?", a: [
      { t: "Lowest cost", s: { slitfoam: 2, compartment: 1, puck: 1 } },
      { t: "It lasts for years", s: { silicone: 3, waterproof: 1 } },
      { t: "Fast fly changes", s: { magnetic: 3, silicone: 1 } },
      { t: "Protecting the flies' shape", s: { compartment: 2, streamer: 2 } } ] }
  ],

  /* ---------------- SHOP / AFFILIATE SETTINGS ----------------
     url:    the store page. "{q}" is replaced with the box style's search words.
     params: added to the end of the url (example for Amazon: "tag=YOURTAG-20").
     wrap:   for networks that wrap a link (AvantLink, FlexOffers, etc.). Paste your
             network's deep-link format with {url} where the store link goes.
     Leave params and wrap empty ("") until you're approved. */
  shop: {
    disclosure: "Some shop links may be affiliate links. If you buy through them, Angler's Fly Boxes may earn a small commission at no extra cost to you. It helps keep the app free.",
    retailers: [
      { id: "amazon", name: "Amazon", note: "Search results for this box style", url: "https://www.amazon.com/s?k={q}", params: "", wrap: "" },
      { id: "trident", name: "Trident Fly Fishing", note: "Fly box department", url: "https://www.tridentflyfishing.com/collections/fly-fishing-fly-boxes", params: "", wrap: "" },
      { id: "riverbum", name: "RiverBum", note: "Fly box department", url: "https://riverbum.com/fly-boxes", params: "", wrap: "" },
      { id: "orvis", name: "Orvis", note: "Fly box department", url: "https://www.orvis.com/fly-fishing-fly-boxes", params: "", wrap: "" }
    ]
  }
};
