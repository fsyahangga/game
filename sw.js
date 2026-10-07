/* PERANG DEDEMIT service worker (from Aether Clash). preload.js fills the 'dedemit-assets' cache (with content hashes) on each visit, so this
   worker only has to answer from it:
   - pictures and fonts: cache first (instant screens, works offline);
   - pages, CSS and JS: network first and always revalidated with the server (cache:'no-cache', so neither the HTTP cache
     nor a CDN max-age can hand back an old copy after a deploy); the cache is the offline fallback;
   - audio/video and range requests: left to the network and HTTP cache (Safari needs real 206 range answers). */
// Renamed for PERANG DEDEMIT so no picture from the old Aether Clash cache is ever served again.
const CACHE = 'dedemit-assets';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || req.headers.has('range') || /\.(mp3|mp4)$/i.test(url.pathname)) return;
  // preload.js refreshes changed files with cache:'no-cache'; those must reach the network, never this cache.
  if (req.cache === 'no-cache' || req.cache === 'reload' || req.cache === 'no-store') return;
  const fromCache = () => caches.open(CACHE).then(cache => cache.match(url.href, { ignoreSearch: true })
    .then(hit => hit || (url.pathname.endsWith('/') ? cache.match(new URL('index.html', url).href) : undefined)));
  if (/\.(webp|png|svg|ttf|woff2)$/i.test(url.pathname)) {
    event.respondWith(fromCache().then(hit => hit || fetch(req)));
    return;
  }
  event.respondWith(fetch(req, { cache: 'no-cache' }).catch(() => fromCache().then(hit => hit || Response.error())));
});
