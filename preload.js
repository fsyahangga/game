/* First-visit loader, in two stages so the menu opens fast:
   1. Menu files (pages, scripts, styles, fonts, brand, assets/menu, assets/ui and the roster portraits, about 6 MB of the
      47 MB in precache.js) download behind the boot screen. window.DEDEMIT_MENU_READY resolves and the menu opens.
   2. Everything else (fight sprites, effects, audio) keeps downloading in the background. Each step fires a
      'dedemit-preload' event ({got, total} for this stage) so the menu can show progress on its start buttons.
      window.AETHER_PRELOAD resolves when it is done, and only then does game.js request its fight images, so nothing is
      fetched twice.
   - Secure pages (https, localhost): files go into Cache Storage ('dedemit-assets') with their content hash. A later visit
     only downloads files whose hash changed, and sw.js serves the pictures straight from that cache.
   - Plain http on a LAN IP (no Cache Storage / service worker there): the download still fills the browser's HTTP cache.
   - file:// or no list: nothing to do, the game boots as before. */
(() => {
  'use strict';
  const list = self.AETHER_PRECACHE, boot = document.getElementById('boot');
  const finish = () => { if (!boot) return; boot.classList.add('done'); setTimeout(() => boot.remove(), 500); };
  window.DEDEMIT_PRELOAD = { got: 0, total: 0, done: false };
  if (!list || !boot || location.protocol === 'file:' || typeof fetch !== 'function') {
    window.DEDEMIT_PRELOAD.done = true; window.AETHER_PRELOAD = window.DEDEMIT_MENU_READY = Promise.resolve(); finish(); return;
  }
  const bar = boot.querySelector('.boot-bar i'), status = boot.querySelector('.boot-status');
  const mb = n => (n / 1e6).toFixed(1).replace('.', ',');
  const forMenu = url => !url.includes('/') || /^assets\/(fonts|brand|menu|ui)\//.test(url) || /\/ui\/portrait[^/]*\.webp$/.test(url);
  const secure = window.isSecureContext && 'caches' in window;
  if (secure && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {});
  const INDEX = '__aether-index';
  let menuReady; window.DEDEMIT_MENU_READY = new Promise(resolve => { menuReady = resolve; });

  function paintBoot(got, total, downloading) {
    const p = Math.min(1, got / Math.max(1, total));
    bar.style.transform = `scaleX(${p})`;
    status.textContent = downloading ? `Membuka menu · ${Math.floor(p * 100)}% · ${mb(got)} / ${mb(total)} MB` : 'Memuat…';
  }
  function paintBackground(got, total) {
    Object.assign(window.DEDEMIT_PRELOAD, { got, total });
    window.dispatchEvent(new CustomEvent('dedemit-preload', { detail: { got, total } }));
  }

  async function run() {
    // The old Aether Clash cache is dropped first: an old service worker still in control answers pictures from it,
    // so emptying it makes even that worker fetch the new files from the network.
    if (secure) await caches.delete('aether-assets').catch(() => {});
    const cache = secure ? await caches.open('dedemit-assets').catch(() => null) : null;
    let index = {};
    if (cache) { try { const hit = await cache.match(INDEX); if (hit) index = await hit.json(); } catch (_) { index = {}; } }
    const saveIndex = () => cache ? cache.put(INDEX, new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } })).catch(() => {}) : null;

    // Fetch one stage's files with six parallel workers; paint(got, total) reports progress.
    async function stage(files, paint) {
      const total = files.reduce((n, f) => n + f[1], 0), todo = [];
      let got = 0;
      for (const f of files) { if (cache && index[f[0]] === f[2] && await cache.match(f[0])) got += f[1]; else todo.push(f); }
      const downloading = todo.length > 0;
      paint(got, total, downloading);
      let next = 0;
      async function worker() {
        while (next < todo.length) {
          const [url, bytes, hash] = todo[next++];
          let seen = 0;
          try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (!res.ok) throw new Error(String(res.status));
            const chunks = [], reader = res.body && res.body.getReader ? res.body.getReader() : null;
            if (reader) for (;;) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); seen += value.byteLength; got += value.byteLength; paint(got, total, true); }
            else { const buf = new Uint8Array(await res.arrayBuffer()); chunks.push(buf); seen = buf.byteLength; got += seen; }
            if (cache) {
              const type = res.headers.get('Content-Type') || '';
              await cache.put(url, new Response(new Blob(chunks, { type }), { headers: { 'Content-Type': type } }));
              index[url] = hash;
            }
          } catch (_) { /* a missing file must not block the game; it simply loads normally later */ }
          got += Math.max(0, bytes - seen); paint(got, total, true);
        }
      }
      await Promise.all(Array.from({ length: 6 }, worker));
      paint(total, total, false);
      await saveIndex();
    }

    await stage(list.files.filter(f => forMenu(f[0])), paintBoot);
    menuReady(); finish();
    await stage(list.files.filter(f => !forMenu(f[0])), paintBackground);
    if (cache) {
      // Forget files from older deploys, then store the hash index for the next visit.
      const keep = new Set(list.files.map(f => new URL(f[0], location.href).href));
      keep.add(new URL(INDEX, location.href).href);
      for (const req of await cache.keys()) if (!keep.has(req.url)) await cache.delete(req);
      for (const url of Object.keys(index)) if (!list.files.some(f => f[0] === url)) delete index[url];
      await saveIndex();
    }
  }
  window.AETHER_PRELOAD = run().catch(() => {}).then(() => { window.DEDEMIT_PRELOAD.done = true; menuReady(); finish(); });
})();
