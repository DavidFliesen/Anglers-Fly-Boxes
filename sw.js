/* Angler's Fly Boxes - service worker (ES5)
   App files (html/js/css/manifest): network first, so a new version shows up on the
   next launch; falls back to the offline copy when there's no signal.
   Images and icons: cache first (they rarely change). */
var VERSION = "v004";
var CACHE = "afb-" + VERSION;
var ASSETS = [
  "./",
  "index.html",
  "css/styles.css",
  "js/data.js",
  "js/app.js",
  "manifest.webmanifest",
  "images/logo-512.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-512-maskable.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png"
];
var NETWORK_TIMEOUT = 4000;

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      /* cache: "reload" skips the browser's HTTP cache so we never store stale files */
      return Promise.all(ASSETS.map(function (url) {
        return fetch(new Request(url, { cache: "reload" })).then(function (res) {
          if (res && res.ok) { return cache.put(url, res); }
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("message", function (e) {
  if (e.data === "skipWaiting") { self.skipWaiting(); }
});

function isAppFile(url, req) {
  if (req.mode === "navigate") { return true; }
  return /\.(html|js|css|webmanifest|json)$/.test(url.pathname) || /\/$/.test(url.pathname);
}

function fromCache(req) {
  return caches.match(req, { ignoreSearch: true }).then(function (hit) {
    if (hit) { return hit; }
    if (req.mode === "navigate") { return caches.match("index.html"); }
  });
}

function networkFirst(req) {
  return new Promise(function (resolve) {
    var done = false;
    var timer = setTimeout(function () {
      fromCache(req).then(function (hit) { if (!done && hit) { done = true; resolve(hit); } });
    }, NETWORK_TIMEOUT);
    fetch(req.url, { cache: "no-cache", credentials: "same-origin" }).then(function (res) {
      clearTimeout(timer);
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req.url.split("?")[0].split("#")[0], copy); });
      }
      if (!done) { done = true; resolve(res); }
    }, function () {
      clearTimeout(timer);
      fromCache(req).then(function (hit) {
        if (!done) { done = true; resolve(hit || new Response("Offline", { status: 503 })); }
      });
    });
  });
}

function cacheFirst(req) {
  return caches.match(req, { ignoreSearch: true }).then(function (hit) {
    if (hit) { return hit; }
    return fetch(req).then(function (res) {
      if (res && res.ok && res.type === "basic") {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") { return; }
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) { return; }
  e.respondWith(isAppFile(url, req) ? networkFirst(req) : cacheFirst(req));
});
