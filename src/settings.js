// Ajustes tab + reminders. Loaded after today.js and before app.js (uses ST, L-less own texts, show/nav lazily).
// Reminders: 2 daily slots (time + kind). Shown as an in-app banner (always works) and as a notification
// from the service worker via Periodic Background Sync (Android decides when it wakes; may be late).
const SX = {
  es: {
    tab: '⚙ Ajustes', title: 'Ajustes',
    install: 'Instalar como app', installBtn: 'Instalar', installed: 'Ya estás usando la app instalada.',
    installHint: 'En Android: abre esta página en Chrome, menú ⋮ y toca "Instalar app" (o "Añadir a la pantalla de inicio").',
    rem: 'Recordatorios', remOn: 'Activar 2 recordatorios al día', slot: 'Recordatorio', quiz: 'Quiz de definiciones', code: 'Código a verificar',
    test: 'Probar notificación', testSent: 'Notificación enviada.', testFail: 'No se pudo enviar: revisa el permiso y que la app esté instalada.',
    perm: 'Permiso de notificaciones', granted: 'concedido', denied: 'bloqueado (actívalo en los ajustes del sitio, en Chrome)', dflt: 'aún sin decidir', na: 'no disponible',
    sw: 'Modo app (service worker)', ok: 'activo', swNo: 'no disponible aquí (solo funciona desde una URL https)',
    per: 'Despertar en segundo plano', perNo: 'no disponible (los avisos llegan al abrir la app)',
    note: 'Android decide cuándo despertar la app en segundo plano, así que el aviso puede llegar con retraso. Para una alarma exacta usa un evento recurrente en tu calendario o reloj.',
    data: 'Tu progreso', export: 'Mostrar y copiar progreso', import: 'Importar progreso',
    dataHint: 'Úsalo para pasar archivados, prioritarios, racha y recordatorios a otro dispositivo o URL.',
    imported: 'Progreso importado.', badJson: 'No pude leer ese texto.', copied: 'Copiado.',
    due: 'Pendiente de hoy', go: 'Empezar', pushTitle: 'C++ · hora de practicar',
  },
  en: {
    tab: '⚙ Settings', title: 'Settings',
    install: 'Install as an app', installBtn: 'Install', installed: 'You are already using the installed app.',
    installHint: 'On Android: open this page in Chrome, tap the ⋮ menu and choose "Install app" (or "Add to Home screen").',
    rem: 'Reminders', remOn: 'Enable 2 reminders per day', slot: 'Reminder', quiz: 'Definitions quiz', code: 'Code to check',
    test: 'Test notification', testSent: 'Notification sent.', testFail: 'Could not send: check the permission and that the app is installed.',
    perm: 'Notification permission', granted: 'granted', denied: 'blocked (enable it in the site settings in Chrome)', dflt: 'not decided yet', na: 'not available',
    sw: 'App mode (service worker)', ok: 'active', swNo: 'not available here (needs an https URL)',
    per: 'Background wake-up', perNo: 'not available (alerts arrive when you open the app)',
    note: 'Android decides when to wake the app in the background, so the alert can arrive late. For an exact alarm, use a recurring event in your calendar or clock app.',
    data: 'Your progress', export: 'Show and copy progress', import: 'Import progress',
    dataHint: 'Use it to move archived, priority, streak and reminders to another device or URL.',
    imported: 'Progress imported.', badJson: 'I could not read that text.', copied: 'Copied.',
    due: 'Pending today', go: 'Start', pushTitle: 'C++ · time to practice',
  },
};
const SXT = () => SX[ST.lang];
const REM = ACT.rem;
const DN = ACT.dn;

function rollDN() {
  const t = Streak.dayKey(Date.now());
  if (DN.date !== t) { DN.date = t; DN.code = false; DN.quiz = false; }
}
rollDN();

// ---- IndexedDB mirror: the service worker cannot read localStorage ----
function idbOpen() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('cppmap', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbSet(k, v) {
  try {
    const db = await idbOpen();
    await new Promise((res, rej) => {
      const tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put(v, k);
      tx.oncomplete = res;
      tx.onerror = () => rej(tx.error);
    });
  } catch (e) { /* without IndexedDB there are no background reminders; the app still works */ }
}
async function syncSW() {
  rollDN();
  await idbSet('cfg', { on: REM.on, slots: REM.slots, lang: ST.lang });
  await idbSet('done', { date: DN.date, code: DN.code, quiz: DN.quiz });
  await idbSet('streak', { days: ACT.days, goal: ACT.goal });
}

/** Called when a round (quiz or code) finishes: that pending reminder is done for today. */
function markDone(kind) {
  rollDN();
  DN[kind] = true;
  saveAct();
  syncSW();
  renderDue();
}

function pendingKinds() {
  if (!REM.on) return [];
  rollDN();
  const now = new Date(), out = [];
  REM.slots.forEach((s) => {
    const [h, m] = s.t.split(':').map(Number);
    const at = new Date(now);
    at.setHours(h, m, 0, 0);
    if (now >= at && !DN[s.k] && !out.some((o) => o.k === s.k)) out.push({ k: s.k, t: s.t });
  });
  return out;
}
const kindName = (k) => (k === 'code' ? SXT().code : SXT().quiz);

function renderDue() {
  const el = document.getElementById('due'), p = pendingKinds();
  if (!p.length) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  el.innerHTML = `<span>⏰ <b>${esc(SXT().due)}</b></span>` +
    p.map((x) => `<button class="btn primary" data-go="${x.k}">${esc(kindName(x.k))} · ${esc(x.t)} ▸ ${esc(SXT().go)}</button>`).join('');
}
document.getElementById('due').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-go]');
  if (b) goKind(b.dataset.go);
});
function goKind(k) {
  if (k === 'code') { nav('code'); CO.s = null; startCode(); }
  else { nav('quiz'); Q.s = null; startQuiz(); }
}

// ---- Service worker, periodic sync, install ----
let swOK = false, perOK = false, deferred = null;
async function regPeriodic() {
  try {
    if (!swOK || !REM.on || !('Notification' in window) || Notification.permission !== 'granted') return false;
    const reg = await navigator.serviceWorker.ready;
    if (!('periodicSync' in reg)) return false;
    const st = await navigator.permissions.query({ name: 'periodic-background-sync' });
    if (st.state !== 'granted') return false;
    await reg.periodicSync.register('cppmap-reminders', { minInterval: 60 * 60 * 1000 });
    return true;
  } catch (e) { return false; }
}
async function initSW() {
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  try { await navigator.serviceWorker.ready; swOK = true; } catch (e) { swOK = false; }
  if (swOK) { await syncSW(); perOK = await regPeriodic(); }
  renderSet();
}
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; renderSet(); });
window.addEventListener('appinstalled', () => { deferred = null; renderSet(); });
const isStandalone = () => {
  try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; }
};

function renderSet() {
  const box = document.getElementById('setbox');
  if (!box) return;
  const l = SXT();
  const perm = 'Notification' in window ? Notification.permission : 'na';
  const permTxt = perm === 'granted' ? `<span class="good">${esc(l.granted)}</span>` : perm === 'denied' ? `<span class="warn">${esc(l.denied)}</span>` : esc(perm === 'default' ? l.dflt : l.na);
  const kinds = [['quiz', l.quiz], ['code', l.code]];
  const slots = REM.slots.map((s, i) => `<div class="setrow"><label>${esc(l.slot)} ${i + 1}</label>
      <input type="time" data-stime="${i}" value="${esc(s.t)}">
      <select data-skind="${i}">${kinds.map(([k, n]) => `<option value="${k}" ${s.k === k ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></div>`).join('');
  const msg = document.getElementById('testmsg')?.textContent ?? '';
  box.innerHTML = `
   <div class="setcard"><h3>${esc(l.install)}</h3>
     ${isStandalone() ? `<p class="stat">${esc(l.installed)}</p>` : deferred ? `<button class="btn primary" data-sact="install">${esc(l.installBtn)}</button>` : `<p class="stat">${esc(l.installHint)}</p>`}
   </div>
   <div class="setcard"><h3>${esc(l.rem)}</h3>
     <label class="switch"><input type="checkbox" data-sact="rem" ${REM.on ? 'checked' : ''}> ${esc(l.remOn)}</label>
     ${slots}
     <div class="setrow"><button class="btn" data-sact="test">${esc(l.test)}</button><span class="stat" id="testmsg">${esc(msg)}</span></div>
     <p class="stat">${esc(l.perm)}: <b>${permTxt}</b></p>
     <p class="stat">${esc(l.sw)}: <b>${swOK ? `<span class="good">${esc(l.ok)}</span>` : `<span class="warn">${esc(l.swNo)}</span>`}</b></p>
     <p class="stat">${esc(l.per)}: <b>${perOK ? `<span class="good">${esc(l.ok)}</span>` : `<span class="warn">${esc(l.perNo)}</span>`}</b></p>
     <p class="stat" style="margin-top:10px">${esc(l.note)}</p>
   </div>
   <div class="setcard"><h3>${esc(l.data)}</h3>
     <p class="stat">${esc(l.dataHint)}</p>
     <textarea class="progtxt" id="progbox" spellcheck="false"></textarea>
     <div class="setrow"><button class="btn" data-sact="export">${esc(l.export)}</button><button class="btn" data-sact="import">${esc(l.import)}</button><span class="stat" id="progmsg"></span></div>
   </div>`;
}

document.getElementById('setbox').addEventListener('change', async (e) => {
  const t = e.target;
  if (t.dataset.stime !== undefined) {
    if (/^\d\d:\d\d$/.test(t.value)) REM.slots[+t.dataset.stime].t = t.value;
    saveAct(); await syncSW(); renderDue();
  } else if (t.dataset.skind !== undefined) {
    REM.slots[+t.dataset.skind].k = t.value === 'code' ? 'code' : 'quiz';
    saveAct(); await syncSW(); renderDue();
  } else if (t.dataset.sact === 'rem') {
    REM.on = t.checked;
    if (REM.on && 'Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch (_) { /* user dismissed */ }
    }
    saveAct(); await syncSW(); perOK = await regPeriodic(); renderSet(); renderDue();
  }
});

document.getElementById('setbox').addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-sact]');
  if (!b) return;
  const a = b.dataset.sact, l = SXT();
  if (a === 'install' && deferred) {
    deferred.prompt();
    try { await deferred.userChoice; } catch (_) { /* dismissed */ }
    deferred = null; renderSet();
  } else if (a === 'test') {
    let text = l.testSent;
    try {
      if (!('Notification' in window)) throw new Error('no notifications');
      if (Notification.permission === 'default') await Notification.requestPermission();
      if (Notification.permission !== 'granted') throw new Error('denied');
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(l.pushTitle, { body: ST.lang === 'en' ? 'This is a test notification.' : 'Esta es una notificación de prueba.', icon: './icons/icon-192.png', badge: './icons/icon-192.png', tag: 'cppmap-test', data: { url: './#quiz-go' } });
    } catch (_) { text = l.testFail; }
    renderSet();
    document.getElementById('testmsg').textContent = text;
  } else if (a === 'export') {
    const data = JSON.stringify({ v: 2, done: [...doneSet], prio: [...prioSet], lang: ST.lang, act: { days: ACT.days, goal: ACT.goal, rem: REM } }, null, 1);
    const box = document.getElementById('progbox');
    box.value = data; box.select();
    let ok = false;
    try { await navigator.clipboard.writeText(data); ok = true; } catch (_) { /* clipboard blocked: text stays selected */ }
    document.getElementById('progmsg').textContent = ok ? l.copied : '';
  } else if (a === 'import') {
    try {
      const o = JSON.parse(document.getElementById('progbox').value);
      if (!o || !Array.isArray(o.done) || !Array.isArray(o.prio)) throw new Error('bad shape');
      doneSet.clear(); prioSet.clear();
      o.done.filter((t) => gIndex[t]).forEach((t) => doneSet.add(t));
      o.prio.filter((t) => gIndex[t]).forEach((t) => { doneSet.delete(t); prioSet.add(t); });
      const x = o.act ?? o; // v1 exports carried only `rem` at the top level
      if (x.days && typeof x.days === 'object') ACT.days = x.days;
      if (Number.isInteger(x.goal) && x.goal > 0) ACT.goal = x.goal;
      if (x.rem && Array.isArray(x.rem.slots) && x.rem.slots.length === 2) {
        REM.on = x.rem.on === true;
        REM.slots = x.rem.slots.map((s) => ({ t: /^\d\d:\d\d$/.test(s.t) ? s.t : '09:00', k: s.k === 'code' ? 'code' : 'quiz' }));
      }
      persist(); saveAct(); await syncSW();
      renderGloss(); renderSide(); renderSet(); renderDue(); renderToday();
      document.getElementById('progmsg').textContent = l.imported;
    } catch (_) { document.getElementById('progmsg').textContent = l.badJson; }
  }
});

document.addEventListener('visibilitychange', () => { if (!document.hidden) renderDue(); });
setInterval(() => {
  renderDue();
  if (document.hidden && REM.on && swOK && navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: 'check' });
}, 60000);
