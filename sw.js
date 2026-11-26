// Bump CACHE_VERSION on every release: it invalidates the old cache.
const CACHE_VERSION = '1.1.0';
const CACHE = `cppmap-${CACHE_VERSION}`;
importScripts('src/streak.js'); // pure streak math, shared with the page
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest', 'styles.css',
  'src/data.js', 'src/streak.js', 'src/today.js', 'src/settings.js', 'src/app.js', 'src/boot.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  // The new worker waits until the user taps "Actualizar" (SKIP_WAITING).
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try { return await fetch(req); }
    catch { return req.mode === 'navigate' ? (await caches.match('index.html')) : Response.error(); }
  })());
});

// ---- Reminders (read the page's mirror in IndexedDB `cppmap`/`kv`) ----
function idbGet(k) {
  return new Promise((resolve) => {
    const r = indexedDB.open('cppmap', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onerror = () => resolve(undefined);
    r.onsuccess = () => {
      try {
        const q = r.result.transaction('kv').objectStore('kv').get(k);
        q.onsuccess = () => resolve(q.result);
        q.onerror = () => resolve(undefined);
      } catch { resolve(undefined); }
    };
  });
}
function idbSet(k, v) {
  return new Promise((resolve) => {
    const r = indexedDB.open('cppmap', 1);
    r.onerror = () => resolve();
    r.onsuccess = () => {
      try {
        const tx = r.result.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(v, k);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch { resolve(); }
    };
  });
}

/** Slot indexes due now: from the slot time up to 6 h later, once per day, if that kind is not done today. */
function dueSlots(now, cfg, done, last) {
  if (!cfg?.on) return [];
  const td = Streak.dayKey(now.getTime());
  const out = [];
  (cfg.slots || []).forEach((s, i) => {
    const [h, m] = String(s.t).split(':').map(Number);
    const at = new Date(now);
    at.setHours(h, m, 0, 0);
    const diff = now - at;
    const completed = done?.date === td && done[s.k];
    if (diff >= 0 && diff <= 6 * 3600e3 && !completed && last[i] !== td) out.push(i);
  });
  return out;
}

const TXT = {
  es: { title: 'C++ · hora de practicar', quiz: 'Toca tu quiz de definiciones.', code: 'Toca verificar código: predice la salida de unos fragmentos.', streak: (n) => ` 🔥 Racha de ${n}: no la pierdas.` },
  en: { title: 'C++ · time to practice', quiz: 'Time for your definitions quiz.', code: 'Time to check code: predict the output of a few snippets.', streak: (n) => ` 🔥 ${n}-day streak: keep it alive.` },
};

async function check() {
  const [cfg, done, last, st] = await Promise.all([idbGet('cfg'), idbGet('done'), idbGet('last'), idbGet('streak')]);
  const now = new Date();
  const prev = last || {};
  const due = dueSlots(now, cfg, done, prev);
  if (!due.length) return;
  const t = TXT[cfg.lang === 'en' ? 'en' : 'es'];
  const risk = st && Streak.atRisk(st.days || {}, st.goal || 10, now.getTime());
  const streakTxt = risk ? t.streak(Streak.summarize(st.days, st.goal, now.getTime()).current) : '';
  const next = { ...prev };
  for (const i of due) {
    const s = cfg.slots[i];
    await self.registration.showNotification(t.title, {
      body: (s.k === 'code' ? t.code : t.quiz) + streakTxt,
      icon: './icons/icon-192.png', badge: './icons/icon-192.png', tag: `cppmap-${i}`,
      data: { url: `./#${s.k === 'code' ? 'codigo-go' : 'quiz-go'}` },
    });
    next[i] = Streak.dayKey(now.getTime());
  }
  await idbSet('last', next);
}

self.addEventListener('periodicsync', (e) => { if (e.tag === 'cppmap-reminders') e.waitUntil(check()); });
self.addEventListener('message', (e) => { if (e.data?.type === 'check') e.waitUntil(check()); });

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || './', self.registration.scope).href;
  e.waitUntil((async () => {
    const open = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (open.length) { const w = await open[0].focus(); return 'navigate' in w ? w.navigate(url) : w; }
    return self.clients.openWindow(url);
  })());
});
