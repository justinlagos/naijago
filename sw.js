/* NaijaGo prototype app shell. Runtime data remains intentionally in-memory. */
var CACHE = 'naijago-shell-v1.4.1';
var SHELL = [
  './', './index.html', './manifest.webmanifest', './assets/logo.svg',
  './css/tokens.css', './css/base.css', './css/site.css', './css/home.css', './css/app.css', './css/responsive.css',
  './js/data.js', './js/util.js', './js/components.js', './js/view-home.js', './js/view-discover.js',
  './js/view-calendar.js', './js/view-advertise.js', './js/view-book.js', './js/view-pass.js',
  './js/view-account.js', './js/view-partner.js', './js/app.js', './js/audit.js'
];
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== CACHE; }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(function (response) {
    var copy = response.clone();
    caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
    return response;
  }).catch(function () { return caches.match(event.request).then(function (cached) { return cached || caches.match('./index.html'); }); }));
});
