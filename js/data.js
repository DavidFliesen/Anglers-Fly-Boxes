/* Angler's Fly Boxes - content data (ES5) */
var AFB_DATA = {

  version: "v005",

  /* ---------------- FISHING CONTEXTS ---------------- */
  contexts: [
    { id: "trout", name: "Trout streams", short: "Trout" },
    { id: "salt", name: "Saltwater", short: "Saltwater" },
    { id: "warm", name: "Ponds & warmwater", short: "Warmwater" }
  ],

  /* ---------------- FLY CATEGORIES ----------------
     Category = the fly's form. What it imitates and where it's fished are separate.
     img: images/flies/<id>.png   words: section-name keywords used to guess the category */
  flyTypes: [
    { id: "dry", name: "Dry Flies", one: "dry fly", waters: ["trout", "warm"],
      words: ["dry", "dries", "mayfl", "caddis", "stonefl", "adams", "parachute", "dun", "spinner", "gnat"],
      blurb: "Float on the surface and imitate adult insects. Use them when fish are rising and feeding on top.",
      subs: ["Mayflies", "Caddisflies", "Stoneflies", "Midge adults"],
      examples: ["Elk Hair Caddis", "Parachute dun", "Blue-Winged Olive", "Stimulator-style stonefly"],
      tip: "Give dries headroom. A lid that presses on hackle and wing posts flattens them." },
    { id: "emerger", name: "Emergers & Soft Hackles", one: "emerger", waters: ["trout"],
      words: ["emerg", "soft hackle", "softhackle", "pupa", "pupae", "cripple", "wet"],
      blurb: "Imitate insects changing from nymph to adult, usually just under the surface. During a hatch, fish often prefer these easy targets.",
      subs: ["Mayfly emergers", "Caddis pupae", "Soft hackles"],
      examples: ["Soft hackle", "CDC emerger", "Sparkle pupa"],
      tip: "Keep emergers next to the matching dries so you can switch fast mid-hatch." },
    { id: "nymph", name: "Nymphs", one: "nymph", waters: ["trout", "warm"],
      words: ["nymph", "pheasant", "hare", "midge", "larva", "scud", "perdigon", "jig", "euro", "stone nymph", "zebra"],
      blurb: "Imitate immature aquatic insects. Trout eat most of their food below the surface, which makes nymphs some of the most productive flies there are.",
      subs: ["Mayfly nymphs", "Stonefly nymphs", "Caddis larvae", "Midge larvae", "Scuds"],
      examples: ["Pheasant Tail", "Hare's Ear", "Zebra Midge", "Perdigon"],
      tip: "Group nymphs one way (by pattern or by insect) and record weight and bead separately." },
    { id: "streamer", name: "Streamers & Baitfish", one: "streamer", waters: ["trout", "salt", "warm"],
      words: ["streamer", "baitfish", "bait", "minnow", "leech", "bugger", "clouser", "surf candy", "bucktail", "sculpin", "deceiver"],
      blurb: "Bigger flies stripped or swung to imitate baitfish, leeches and other prey. They work in fresh and salt water.",
      subs: ["Baitfish", "Leeches", "Buggers", "Sculpins"],
      examples: ["Woolly Bugger", "Clouser Minnow", "Surf Candy", "Bucktail baitfish"],
      tip: "Long flies need a deep box or wallet so tails and wings stay straight." },
    { id: "terrestrial", name: "Terrestrials", one: "terrestrial", waters: ["trout", "warm"],
      words: ["terrestrial", "hopper", "ant", "beetle", "cricket", "cicada", "inchworm"],
      blurb: "Land insects such as ants, beetles, grasshoppers and crickets that fall into the water and become an easy meal.",
      subs: ["Hoppers", "Ants", "Beetles", "Crickets"],
      examples: ["Foam hopper", "Foam beetle", "Parachute ant"],
      tip: "Foam bugs are bulky. A compartment or deep-foam box keeps their shape." },
    { id: "egg", name: "Egg Patterns", one: "egg", waters: ["trout"],
      words: ["egg"],
      blurb: "Imitate fish eggs, a natural food for trout and steelhead around spawning time. Often tied from yarn; orange and pink are favorites.",
      subs: ["Single eggs", "Clusters", "Bead eggs"],
      examples: ["Yarn egg", "Nuke egg", "Bead egg"],
      tip: "Group eggs by color shade so you can match what's drifting." },
    { id: "worm", name: "Worms", one: "worm", waters: ["trout", "warm"],
      words: ["worm", "squirm", "mop"],
      blurb: "Imitate real worms, a high-protein food that's easy to find for fish after rain raises the water.",
      subs: ["Chenille worms", "Squirmy worms", "Mop flies"],
      examples: ["San Juan Worm", "Squirmy worm"],
      tip: "Keep a few for high, off-color water after storms." },
    { id: "attractor", name: "Attractors", one: "attractor", waters: ["trout", "warm"],
      words: ["attractor", "hot spot", "hotspot", "flash", "confidence", "prospect"],
      blurb: "Built to grab attention with bright color, flash or movement rather than copy one food. Good for prospecting and as confidence flies.",
      subs: ["Hot-spot nymphs", "Flashy wets", "Bright dries"],
      examples: ["Hot-spot nymph", "Flashback nymph", "Bright foam dry"],
      tip: "Great for searching new water or when nothing is hatching." },
    { id: "popper", name: "Poppers & Surface Bugs", one: "popper", waters: ["warm", "salt"],
      words: ["popper", "slider", "gurgler", "spider", "topwater", "surface", "bug", "bluegill", "bass", "panfish", "frog", "diver"],
      blurb: "Floating bugs that pop, gurgle or wiggle on top. A favorite for bass and bluegill, and some saltwater fish.",
      subs: ["Poppers", "Sliders & gurglers", "Foam spiders"],
      examples: ["Foam popper", "Rubber-leg spider", "Gurgler"],
      tip: "Poppers are bulky. Open compartments keep faces and legs from bending." },
    { id: "crustacean", name: "Shrimp & Crabs", one: "shrimp/crab", waters: ["salt", "trout", "warm"],
      words: ["shrimp", "crab", "crayfish", "crawfish", "craw", "flats", "grass"],
      blurb: "Imitate shrimp, crabs and crayfish. Essential on saltwater flats and grass beds, and crayfish patterns work for bass and trout.",
      subs: ["Shrimp", "Crabs", "Crayfish"],
      examples: ["Shrimp pattern", "Crab pattern", "Crayfish pattern"],
      tip: "Rinse saltwater flies in fresh water and let them dry before boxing them." }
  ],

  /* actual fly colors; tone is used only for light-to-dark sorting */
  colors: [
    { id: "black", name: "Black", hex: "#1E1E1E", tone: 3 },
    { id: "brown", name: "Brown", hex: "#6B4423", tone: 2 },
    { id: "olive", name: "Olive", hex: "#6B7B3A", tone: 2 },
    { id: "tan", name: "Tan", hex: "#C9A66B", tone: 1 },
    { id: "gray", name: "Gray", hex: "#8A8F94", tone: 1 },
    { id: "cream", name: "Cream", hex: "#EFE3C8", tone: 0 },
    { id: "white", name: "White", hex: "#FFFFFF", tone: 0 },
    { id: "yellow", name: "Yellow", hex: "#F2C94C", tone: 0 },
    { id: "chartreuse", name: "Chartreuse", hex: "#B5D334", tone: 4 },
    { id: "orange", name: "Orange", hex: "#F08A24", tone: 4 },
    { id: "pink", name: "Pink", hex: "#F29CB2", tone: 4 },
    { id: "red", name: "Red", hex: "#C0392B", tone: 4 },
    { id: "purple", name: "Purple", hex: "#6C4BA0", tone: 3 },
    { id: "flash", name: "Flash", hex: "#C8CDD2", tone: 4 }
  ],

  sizes: ["4/0", "2/0", "1/0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22"],
  hookStyles: ["Standard", "Jig", "Curved (scud/caddis)", "Long shank", "Saltwater"],
  beads: ["None", "Brass bead", "Tungsten bead", "Bead-chain eyes", "Dumbbell eyes", "Cone head"],
  weights: ["Floats / unweighted", "Light", "Medium", "Heavy"],

  /* ---------------- ORGANIZING APPROACHES ----------------
     dim: "group" = how flies are grouped, "carry" = what goes on the water, "finish" = works with any */
  approaches: [
    { id: "type", dim: "group", name: "By Fly Type", icon: "🗂️",
      short: "Group flies by what they are: dries, nymphs, streamers and so on.",
      idea: "The classic starting point. Every fly goes where its category lives, so you always know where your dries or nymphs are. Inside each group you can split again by pattern or by the insect it imitates.",
      steps: [
        "Dump your flies out and sort them into piles by category: dries, nymphs, streamers, and so on.",
        "Give each pile its own box, or its own side or section of a bigger box.",
        "Pick ONE way to split each group (by pattern or by insect) and stick with it.",
        "Record extra details, like a jig hook or tungsten bead, as details, not as another section.",
        "Label the outside so you can grab the right box without opening it."
      ],
      layouts: {
        trout: [
          { name: "Dry Fly Box", sections: ["Mayflies", "Caddis", "Stoneflies", "Terrestrials"] },
          { name: "Nymph Box", sections: ["Pheasant Tails", "Hare's Ears", "Midges", "Attractor Nymphs"] },
          { name: "Streamer Box", sections: ["Baitfish", "Leeches", "Buggers"] }
        ],
        salt: [
          { name: "Baitfish Box", sections: ["Clouser Minnows", "Surf Candy", "Bucktail Baitfish"] },
          { name: "Shrimp & Crab Box", sections: ["Shrimp", "Crabs"] },
          { name: "Topwater Box", sections: ["Poppers", "Gurglers"] }
        ],
        warm: [
          { name: "Topwater Box", sections: ["Poppers", "Sliders", "Foam Spiders"] },
          { name: "Subsurface Box", sections: ["Nymphs", "Buggers", "Baitfish Streamers", "Crayfish"] }
        ]
      },
      boxes: ["slimpocket", "slitfoam", "compartment", "streamer"],
      pros: ["Easy to learn: great for building your fly vocabulary.", "You always know where a category lives.", "Works well for home storage and restocking."],
      cons: ["Can mean carrying several boxes.", "Doesn't tell you which flies to bring for a given water."],
      best: "Newer anglers, fly tyers, and anyone organizing their main collection at home." },

    { id: "water", dim: "group", name: "By Water & Species", icon: "🌊",
      short: "Group flies by where you use them: a trout box, a flats box, a pond box.",
      idea: "Instead of sorting by what a fly is, sort by where you'll use it. Each box holds every kind of fly that water calls for. Grab the right box and you're packed.",
      steps: [
        "List the kinds of water you actually fish and the fish you target in each.",
        "Make one box (or one side) per water.",
        "Fill each with that water's food: baitfish for the beach, shrimp and crabs for the grass, poppers and nymphs for the pond.",
        "It's fine to repeat a pattern in two boxes. Fish don't know what a fly was 'meant' for.",
        "Keep a little tippet and a nipper with each box so it's grab-and-go."
      ],
      layouts: {
        trout: [
          { name: "Freestone Stream Box", sections: ["Dries", "Nymphs", "Streamers"] },
          { name: "Tailwater Box", sections: ["Midges", "Small Nymphs", "Scuds", "Small Dries"] }
        ],
        salt: [
          { name: "Open Water & Beach Box", sections: ["Clouser Minnows", "Surf Candy", "Bucktail Baitfish"] },
          { name: "Grass Flats Box", sections: ["Shrimp", "Crabs", "Small Baitfish"] }
        ],
        warm: [
          { name: "Bluegill Box", sections: ["Foam Spiders", "Small Poppers", "Nymphs"] },
          { name: "Bass Box", sections: ["Poppers", "Buggers", "Crayfish", "Baitfish Streamers"] }
        ]
      },
      boxes: ["waterproof", "streamer", "compartment", "boatbox"],
      pros: ["One box per trip: fast to pack.", "Every box is tuned to the food in that water."],
      cons: ["Some patterns get duplicated across boxes.", "New waters need a new box or a careful mix."],
      best: "Anglers who fish several very different waters, like trout streams, saltwater and ponds." },

    { id: "hatch", dim: "group", name: "By Hatch & Season", icon: "📅",
      short: "Group flies by when you use them: what's hatching or what fish eat that time of year.",
      idea: "Fish key on the food that's most available at that place and time. Carry what's likely on the menu and you carry less and choose faster. Hatch charts and local fishing reports tell you what shows up when.",
      steps: [
        "Find a hatch chart or local report for the water you fish.",
        "Note what shows up each season, and its size and color.",
        "Build a box (or side) per season with those flies.",
        "Rotate boxes as the seasons change.",
        "No chart? Learn the food: what lives in that water and what falls into it."
      ],
      layouts: {
        trout: [
          { name: "Spring Hatch Box", sections: ["Mayfly Nymphs", "Emergers", "Mayfly Dries", "Caddis"] },
          { name: "Summer Box", sections: ["Hoppers", "Ants & Beetles", "Caddis", "Light Nymphs"] },
          { name: "Fall & Winter Box", sections: ["Streamers", "Eggs", "Midges", "Small Nymphs"] }
        ],
        salt: [
          { name: "Warm-Water Flats Box", sections: ["Shrimp", "Crabs", "Small Baitfish"] },
          { name: "Fall Baitfish Box", sections: ["Large Baitfish", "Small Baitfish", "Topwater"] },
          { name: "Cold-Water Box", sections: ["Small Shrimp", "Slow Baitfish"] }
        ],
        warm: [
          { name: "Spring Spawn Box", sections: ["Small Nymphs", "Buggers", "Foam Spiders"] },
          { name: "Summer Topwater Box", sections: ["Poppers", "Sliders", "Hoppers"] },
          { name: "Fall & Winter Box", sections: ["Baitfish Streamers", "Crayfish", "Slow Nymphs"] }
        ]
      },
      boxes: ["slimpocket", "compartment", "silicone"],
      pros: ["You carry fewer flies with more confidence.", "Teaches you what fish eat and when."],
      cons: ["Needs a little research.", "Unexpected hatches can catch you short."],
      best: "Anglers who like the 'why' behind fly choice and fish the same waters through the year." },

    { id: "puck", dim: "carry", name: "Main Box + Day Box or Puck", icon: "🧰",
      short: "Keep your full selection in main boxes; take a small day box or puck with just today's flies.",
      idea: "Your main boxes hold everything. Before a trip, move the handful of flies you expect to use into a small day box or puck. You fish light, and the main box can stay in the pack or at home.",
      steps: [
        "Set up your main boxes the way you like to group flies.",
        "Before each trip, decide what the fish are likely eating.",
        "Move just those flies into a day box or puck. In this app, Trips does this and keeps your counts right.",
        "Fish from the small box.",
        "When you get home, unpack what's left back into your main boxes and restock."
      ],
      layouts: {
        trout: [
          { name: "Main Trout Box", sections: ["Dries", "Nymphs", "Streamers", "Attractors"] },
          { name: "Day Puck: Small Creek", kind: "puck", sections: ["Attractor Nymph", "Egg"] }
        ],
        salt: [
          { name: "Main Saltwater Box", sections: ["Baitfish", "Shrimp", "Crabs", "Topwater"] },
          { name: "Day Box: Morning Flats", kind: "puck", sections: ["Shrimp", "Crabs"] }
        ],
        warm: [
          { name: "Main Pond Box", sections: ["Poppers", "Nymphs", "Buggers", "Crayfish"] },
          { name: "Day Puck: Bluegill", kind: "puck", sections: ["Foam Spiders", "Small Poppers"] }
        ]
      },
      boxes: ["silicone", "puck", "magnetic"],
      pros: ["You're always covered, but you fish light.", "Fly changes are fast with only a few choices."],
      cons: ["Needs a few minutes of planning before each trip.", "Day boxes and pucks hold only a handful."],
      best: "Anglers who plan trips and don't want to wade with every fly they own." },

    { id: "forage", dim: "carry", name: "One Box, Just the Essentials", icon: "🎯",
      short: "Carry one box with a few proven flies in a couple of sizes, matched to what the fish eat.",
      idea: "Many anglers carry far more flies than they use. One well-chosen box covers the most common food where you fish, plus a few confidence flies and wild cards. It's the lightest, simplest way to fish.",
      steps: [
        "Learn the main food where you fish: insects, baitfish, crustaceans, and what falls in from land.",
        "Pick a few patterns that cover that food, in two sizes each.",
        "Add a couple of confidence flies you trust and one or two wild cards.",
        "Include a lighter and a heavier version of key flies for different depths.",
        "If the box gets crowded, take something out. That's the whole point."
      ],
      layouts: {
        trout: [ { name: "One Trout Box", sections: ["Dries (2 sizes)", "Terrestrials", "Nymphs & Soft Hackles", "Streamers"] } ],
        salt: [ { name: "One Saltwater Box", sections: ["Baitfish", "Shrimp", "Crabs"] } ],
        warm: [ { name: "One Pond Box", sections: ["Poppers", "Foam Spiders", "Nymphs", "Buggers"] } ]
      },
      boxes: ["silicone", "slimpocket", "waterproof"],
      pros: ["The lightest system to carry.", "Quick decisions, more time fishing."],
      cons: ["Fewer backups if fish get picky.", "Takes time to learn what fish eat."],
      best: "Anglers who want one box on the water, fish familiar places, or are tired of over-packing." },

    { id: "order", dim: "finish", name: "Sort Within a Section", icon: "↕️",
      short: "Optional: line flies up by size, pattern, color or weight so the right one is easy to spot.",
      idea: "Not a whole system, and not required. If your layout already works, keep it. When a section gets messy, sorting it the same way every time helps your eye find the right fly fast.",
      steps: [
        "Choose one order and use it in every section: by size, by pattern then size, by color, or by weight.",
        "Hook sizes run big to small like this: 2/0, 1/0, 2, 4, 6 ... 16, 18, 20.",
        "Leave a gap at the end of each row for new flies.",
        "In My Boxes, Sort lets you pick an order, or keep your own."
      ],
      layouts: { all: [ { name: "Any Section", sections: ["Big → Small", "Pattern → Size", "Light → Dark", "Heavy → Light"] } ] },
      boxes: ["silicone", "slitfoam"],
      pros: ["Works with every system.", "Easy to spot gaps to restock."],
      cons: ["Optional upkeep after trips."],
      best: "Anyone whose sections are getting crowded." },

    { id: "label", dim: "finish", name: "Label Your Boxes", icon: "🏷️",
      short: "Short, waterproof labels so you grab the right box without opening it.",
      idea: "Short labels work best on a real box: what's inside and the size range. They turn a stack of identical boxes into a system.",
      steps: [
        "Use waterproof labels or a paint pen on the lid and edge.",
        "Keep it short: 'NYMPHS · #14–#18' or 'SHRIMP & CRABS'.",
        "Color-code if you like: one color for fresh, one for salt.",
        "Update the label when a box changes jobs. My Boxes suggests labels for you."
      ],
      layouts: { all: [ { name: "Label Examples", sections: ["DRIES · #12–#18", "NYMPHS · #14–#20", "SHRIMP & CRABS"] } ] },
      boxes: ["slimpocket", "waterproof"],
      pros: ["Instant box identification."],
      cons: ["Labels need updating as boxes change."],
      best: "Anyone with more than two boxes." }
  ],

  /* ---------------- SEASON STARTING POINTS (general, by water) ---------------- */
  seasons: {
    trout: [
      { months: [11, 0, 1], name: "Winter", hints: ["Midges in every stage: larvae, pupae and tiny adults.", "Small nymphs fished slow and deep.", "Egg patterns where trout are spawning."] },
      { months: [2, 3, 4], name: "Spring", hints: ["Mayfly and caddis hatches start. Check a hatch chart.", "Carry nymphs, emergers and dries for the same insect.", "Worms after spring rains raise the water."] },
      { months: [5, 6, 7], name: "Summer", hints: ["Terrestrials: hoppers, ants and beetles.", "Early and late caddis and mayfly activity.", "Lightly weighted flies for low, clear water."] },
      { months: [8, 9, 10], name: "Fall", hints: ["Streamers: trout feed hard before winter.", "Egg patterns around fall spawning.", "Small mayflies on mild, cloudy days."] }
    ],
    salt: [
      { months: [11, 0, 1], name: "Winter", hints: ["Fish often move slower in cold water: smaller flies, slower strips.", "Small shrimp and baitfish patterns.", "Clear water: lighter colors and longer leaders."] },
      { months: [2, 3, 4], name: "Spring", hints: ["As water warms, shrimp and small baitfish get active.", "Carry shrimp and crab patterns for flats and grass.", "Bring a range of weights for changing depth and tide."] },
      { months: [5, 6, 7], name: "Summer", hints: ["Early morning and evening are often best on shallow flats.", "Shrimp, crabs and small baitfish.", "Topwater flies at low light."] },
      { months: [8, 9, 10], name: "Fall", hints: ["Many coasts see baitfish runs in fall.", "Larger baitfish patterns matched to local bait size.", "Keep shrimp and crabs for the flats."] }
    ],
    warm: [
      { months: [11, 0, 1], name: "Winter", hints: ["Fish deep and slow with small nymphs and buggers.", "Warm afternoons are often best.", "Crayfish and baitfish patterns for bass."] },
      { months: [2, 3, 4], name: "Spring", hints: ["Bluegill and bass move shallow as water warms.", "Small nymphs, buggers and foam spiders.", "Bring a few poppers for warm, calm evenings."] },
      { months: [5, 6, 7], name: "Summer", hints: ["Poppers and sliders early and late in the day.", "Hoppers and foam bugs along grassy banks.", "Go deeper with nymphs and buggers at midday."] },
      { months: [8, 9, 10], name: "Fall", hints: ["Bass chase baitfish: streamers in shad and minnow colors.", "Crayfish patterns near rocks and wood.", "Topwater on warm fall days."] }
    ]
  },

  /* ---------------- QUIZ (rule-based in app code) ---------------- */
  quiz: [
    { id: "where", q: "What do you fish for most?", a: [
      { id: "trout", t: "Trout in streams and rivers" },
      { id: "salt", t: "Saltwater fish" },
      { id: "warm", t: "Bass and bluegill in ponds and lakes" },
      { id: "mix", t: "A mix of these" } ] },
    { id: "boxes", q: "How many boxes do you want to carry while fishing?", note: "Not counting what stays at home.", a: [
      { id: "one", t: "Just one" },
      { id: "few", t: "Two or three" },
      { id: "many", t: "I don't mind several" } ] },
    { id: "plan", q: "Do you plan which flies to bring before a trip?", a: [
      { id: "yes", t: "Yes, usually" },
      { id: "some", t: "Sometimes" },
      { id: "no", t: "Rarely, I just go" } ] },
    { id: "exp", q: "How long have you been fly fishing?", a: [
      { id: "new", t: "I'm new" },
      { id: "few", t: "A few seasons" },
      { id: "many", t: "Many years" } ] },
    { id: "pain", q: "What bugs you most about your flies right now?", a: [
      { id: "find", t: "I can't find the fly I want" },
      { id: "carry", t: "I carry too much" },
      { id: "which", t: "I don't know which flies to bring" },
      { id: "runout", t: "I run out of the right fly" } ] }
  ],

  /* ---------------- BOX STYLES (physical boxes) ---------------- */
  boxStyles: [
    { id: "slitfoam", name: "Slit Foam Box", q: "slit foam fly box",
      short: "Rows of slit foam that grip each hook. The classic all-purpose box.",
      holds: "Nymphs, wet flies, small dries and small streamers.",
      pros: ["Affordable and easy to find", "High capacity, often double-sided", "Clean rows are easy to scan"],
      cons: ["Foam tears and wears out over the years", "Low foam ridges and shallow lids crush bushy dries"],
      tip: "For dries, choose tall foam ridges and a deep lid." },
    { id: "silicone", name: "Silicone Slot Box", q: "silicone fly box",
      short: "Slotted silicone that grips hooks tight and doesn't wear out like foam.",
      holds: "Nymphs, jig flies, small dries and small streamers.",
      pros: ["Lasts far longer than foam", "Flies stay put if you drop it", "Usually slim and easy to pocket"],
      cons: ["Costs more than foam", "Slots suit a range of hook sizes, not all"],
      tip: "A good buy-once upgrade for the box you use most." },
    { id: "compartment", name: "Compartment Box", q: "compartment fly box",
      short: "Open cells (sometimes with flip lids) so flies sit loose and keep their shape.",
      holds: "Bushy dries, hoppers, poppers, crabs and shrimp, and tiny midges.",
      pros: ["Plenty of headroom: nothing gets crushed", "Holds lots of bulky flies", "Cells make natural groups"],
      cons: ["Flies can blow out when you open it in wind", "Harder to see one size at a glance"],
      tip: "Clear lids let you find the right cell before you open it." },
    { id: "magnetic", name: "Magnetic Box", q: "magnetic fly box",
      short: "A magnetic base holds hooks, so you can drop a fly in and close the lid.",
      holds: "Nymphs, midges, soft hackles and small streamers.",
      pros: ["Fastest fly changes", "Nothing to poke or tear", "Great for tiny flies"],
      cons: ["Flies can slide around if shaken", "Not for big, bushy flies"],
      tip: "Pair with a slot box for flies you want in exact rows." },
    { id: "streamer", name: "Streamer Box or Wallet", q: "streamer fly box",
      short: "A deep box with tall foam bars, or a wallet with fleece pages, made for long flies.",
      holds: "Streamers, buggers, leeches and saltwater baitfish patterns.",
      pros: ["Tails and wings stay straight", "Big hooks held securely", "Wallets pack flat"],
      cons: ["Bulky in a pocket", "Wallets don't protect against crushing"],
      tip: "Let wet streamers dry before closing the box." },
    { id: "waterproof", name: "Waterproof Box", q: "waterproof fly box",
      short: "A gasket-sealed case that keeps water out. Most float. Many have silicone or foam inside.",
      holds: "Saltwater flies and anything that rides in a kayak, boat or wet sling.",
      pros: ["Keeps spray and rain out", "Usually floats", "Tough shell"],
      cons: ["Thicker and heavier", "Wet flies sealed inside will rust: dry them first"],
      tip: "Rinse with fresh water and dry it open after saltwater trips." },
    { id: "slimpocket", name: "Slim Pocket Box", q: "slim fly box",
      short: "Low-profile boxes that stack in a shirt or vest pocket.",
      holds: "Nymphs, wet flies, midges and small dries.",
      pros: ["Carry several without the bulk", "Light and inexpensive"],
      cons: ["Small capacity", "Too thin for bushy flies"],
      tip: "Use a different color per box so you grab the right one by feel." },
    { id: "puck", name: "Fly Puck or Day Box", q: "fly puck",
      short: "A small case that holds a handful of flies for one trip or one water.",
      holds: "The few patterns you expect to use today.",
      pros: ["Fits a pocket, lanyard or pack strap", "Forces you to carry only what matters", "Cheap enough to own several"],
      cons: ["Holds only a few flies", "Not a home for your whole collection"],
      tip: "Keep one loaded for each home water." },
    { id: "boatbox", name: "Boat Box / Home Storage", q: "boat fly box",
      short: "A large compartment box with a handle, for boats and for restocking at home.",
      holds: "Your whole collection: dozens of each pattern.",
      pros: ["Huge capacity", "Easy to restock smaller boxes from it"],
      cons: ["Not for wading", "Takes up space"],
      tip: "Organize it like your on-water boxes so restocking is quick." }
  ],

  accessories: [
    { id: "patch", name: "Fly Drying Patch", q: "fly drying patch",
      short: "A clip-on patch that holds used flies until they dry, so wet flies don't rust in your box." }
  ],

  /* ---------------- BOX FINDER (fit-based) ----------------
     s: style scores.  fit: why that style fits, shown with the result */
  boxFinder: [
    /* the flies' size and shape matter most, so this question counts double */
    { id: "holds", q: "What flies will this box hold?", a: [
      { t: "Small flies: nymphs, midges, small dries", s: { silicone: 6, slimpocket: 4, magnetic: 4, slitfoam: 4 },
        fit: { silicone: "Small flies sit tight in silicone slots.", slimpocket: "Small flies don't need a deep box.", magnetic: "Tiny hooks are easy to drop onto a magnet.", slitfoam: "Foam rows hold small hooks well and cost little." } },
      { t: "Bushy dries, hoppers or foam bugs", s: { compartment: 8, slitfoam: 2 },
        fit: { compartment: "Bushy flies need headroom so the lid doesn't crush hackle, wings and posts.", slitfoam: "Tall foam ridges and a deep lid can also work for dries." } },
      { t: "Long streamers and baitfish", s: { streamer: 8, waterproof: 2 },
        fit: { streamer: "Long flies need length and depth so tails stay straight.", waterproof: "Deep waterproof boxes also fit big streamers." } },
      { t: "Shrimp, crabs and poppers", s: { compartment: 6, waterproof: 4, boatbox: 2 },
        fit: { compartment: "Bulky shrimp, crabs and poppers keep their shape in open cells.", waterproof: "Saltwater shrimp and crabs ride well in a sealed box.", boatbox: "Big compartments hold lots of bulky flies." } },
      { t: "A mix", s: { slitfoam: 4, silicone: 4, compartment: 2 },
        fit: { slitfoam: "Foam handles a wide range of hook sizes.", silicone: "Silicone slots hold most small and medium flies." } } ] },
    { id: "ride", q: "Where will the box ride?", a: [
      { t: "Shirt or vest pocket", s: { slimpocket: 3, puck: 2, magnetic: 1, silicone: 1 },
        fit: { slimpocket: "It needs to be thin enough for a pocket.", puck: "A puck fits any pocket.", silicone: "Silicone boxes are often slim." } },
      { t: "Chest pack or sling", s: { silicone: 2, slitfoam: 2, waterproof: 1, magnetic: 1 },
        fit: { silicone: "A mid-size box fits most chest packs.", slitfoam: "A mid-size box fits most chest packs." } },
      { t: "Backpack", s: { streamer: 2, slitfoam: 1, waterproof: 1 },
        fit: { streamer: "A backpack has room for a deeper box." } },
      { t: "Boat or kayak", s: { boatbox: 3, waterproof: 2 },
        fit: { boatbox: "In a boat, capacity and a handle matter more than size.", waterproof: "Boats and kayaks get splashed; a sealed box helps." } },
      { t: "It stays at home", s: { boatbox: 4, compartment: 1 },
        fit: { boatbox: "At home, capacity matters most." } } ] },
    { id: "wet", q: "How wet will it get?", a: [
      { t: "Mostly stays dry", s: {}, fit: {} },
      { t: "Rain, splashes and wading", s: { waterproof: 1, silicone: 1 },
        fit: { waterproof: "A seal keeps rain and splashes out.", silicone: "Silicone doesn't soak up water like foam." } },
      { t: "Saltwater, or it could go overboard", s: { waterproof: 4 },
        fit: { waterproof: "Salt spray and dunkings call for a sealed box that floats." } } ] },
    { id: "count", q: "How many flies will it hold?", a: [
      { t: "A handful for one trip", s: { puck: 4, slimpocket: 1 }, fit: { puck: "A handful of flies fits a puck or day box." } },
      { t: "About 30 to 100", s: { slimpocket: 1, silicone: 1, magnetic: 1, slitfoam: 1 }, fit: {} },
      { t: "About 100 to 300", s: { slitfoam: 2, silicone: 1, compartment: 1, waterproof: 1 }, fit: { slitfoam: "Double-sided foam boxes hold a lot without crowding." } },
      { t: "Hundreds", s: { boatbox: 4 }, fit: { boatbox: "Hundreds of flies need a big storage box." } } ] },
    { id: "budget", q: "What's your budget?", a: [
      { t: "Keep it cheap", s: { slitfoam: 2, compartment: 1, puck: 1, slimpocket: 1 }, fit: { slitfoam: "Foam boxes are the budget pick.", compartment: "Simple compartment boxes are inexpensive." } },
      { t: "Somewhere in the middle", s: {}, fit: {} },
      { t: "Buy once, buy right", s: { silicone: 2, waterproof: 2 }, fit: { silicone: "Silicone lasts for years.", waterproof: "A good sealed box lasts for years." } } ] }
  ],

  /* ---------------- KITS ---------------- */
  kits: [
    { id: "pond", water: "warm", name: "Pond Hoppin' Kit", note: "Walk the ponds and pick at bluegill and bass.",
      items: ["Pond box or puck (bluegill & bass flies)", "Spool of 10 lb mono", "Spool of 3X tippet", "Hemostats / cutters", "Rod & reel"] },
    { id: "trout", water: "trout", name: "Trout Day Kit", note: "A day box or puck with today's flies, plus the basics.",
      items: ["Day box or puck for today's water", "Tippet: 4X-6X", "Nippers & forceps", "Floatant & indicators", "Split shot", "Drying patch"] },
    { id: "salt", water: "salt", name: "Saltwater Kit", note: "Pick the box for open water or the flats.",
      items: ["Saltwater box (sealed)", "Fluorocarbon leader material", "Pliers", "Stripping guards", "Fresh-water rinse when home"] }
  ],

  tripChecklist: [
    "Check a hatch chart or local fishing report",
    "Note what the fish are likely eating",
    "Pick flies that match its size and color",
    "Pack a day box or puck",
    "Add a couple of confidence flies",
    "Restock anything running low",
    "Pack tippet, nippers and hemostats"
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
