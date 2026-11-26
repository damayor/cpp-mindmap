// "Hoy" tab: daily goal, streak, 14-day history and reminder settings.
// Loaded before app.js; uses ST, esc, $ lazily (they exist by the time these run).
const ACT_KEY = 'cppmap.act.v1';
const TXT = {
  es: {
    tab: 'Hoy', title: 'Hoy', answered: 'respuestas hoy', goalMet: 'Meta diaria cumplida ✓',
    left: (n) => `Faltan ${n} respuesta${n === 1 ? '' : 's'} para la meta.`,
    streak: (n) => (n === 1 ? 'día seguido' : 'días seguidos'), best: 'Mejor racha',
    open: 'Hoy sigue abierto: la racha se mantiene hasta medianoche.',
    risk: (n) => `🔥 Racha de ${n} en riesgo: completa la meta de hoy.`,
    history: 'Últimos 14 días', goal: 'Meta diaria (respuestas)', start: 'Practicar ahora',
    quiz: 'Quiz de conceptos', code: 'Predecir código',
    install: 'Instalar app', installed: 'Instalada', update: 'Nueva versión disponible', updateBtn: 'Actualizar',
    persist: 'Tus datos se guardan en este dispositivo.',
  },
  en: {
    tab: 'Today', title: 'Today', answered: 'answers today', goalMet: 'Daily goal reached ✓',
    left: (n) => `${n} more answer${n === 1 ? '' : 's'} to reach the goal.`,
    streak: (n) => (n === 1 ? 'day in a row' : 'days in a row'), best: 'Best streak',
    open: "Today is still open: your streak is safe until midnight.",
    risk: (n) => `🔥 Your ${n}-day streak is at risk: finish today's goal.`,
    history: 'Last 14 days', goal: 'Daily goal (answers)', start: 'Practice now',
    quiz: 'Concept quiz', code: 'Predict the code',
    install: 'Install app', installed: 'Installed', update: 'New version available', updateBtn: 'Update',
    persist: 'Your data is stored on this device.',
  },
};
const TT = () => TXT[ST.lang];

const DEF_SLOTS = () => [{ t: '09:00', k: 'code' }, { t: '19:00', k: 'quiz' }];
const ACT = { days: {}, goal: 10, rem: { on: false, slots: DEF_SLOTS() }, dn: { date: '', code: false, quiz: false } };
try {
  const r = JSON.parse(localStorage.getItem(ACT_KEY) || 'null');
  if (r && typeof r === 'object') {
    if (r.days && typeof r.days === 'object') ACT.days = r.days;
    if (Number.isInteger(r.goal) && r.goal > 0) ACT.goal = r.goal;
    if (r.rem && Array.isArray(r.rem.slots) && r.rem.slots.length === 2) {
      ACT.rem = { on: r.rem.on === true, slots: r.rem.slots.map((x) => ({ t: /^\d\d:\d\d$/.test(x.t) ? x.t : '09:00', k: x.k === 'code' ? 'code' : 'quiz' })) };
    }
    if (r.dn && typeof r.dn === 'object') ACT.dn = { date: String(r.dn.date || ''), code: r.dn.code === true, quiz: r.dn.quiz === true };
  }
} catch (e) { /* empty or corrupt storage: start fresh */ }

function saveAct() {
  try { localStorage.setItem(ACT_KEY, JSON.stringify(ACT)); } catch (e) { /* storage full or blocked */ }
}

function recordActivity() {
  const k = Streak.dayKey(Date.now());
  ACT.days[k] = (ACT.days[k] ?? 0) + 1;
  saveAct();
  renderToday();
  if (typeof syncSW === 'function') syncSW();
}

let waitingWorker = null;
function setWaitingWorker(w) { waitingWorker = w; renderToday(); }

function renderToday() {
  const box = document.getElementById('today');
  if (!box) return;
  const t = TT(), now = Date.now();
  const s = Streak.summarize(ACT.days, ACT.goal, now);
  const pct = Math.min(100, Math.round((s.today.count / s.today.goal) * 100));
  const risk = Streak.atRisk(ACT.days, ACT.goal, now);
  const days = Streak.recentDays(ACT.days, ACT.goal, now, 14);
  box.innerHTML = `
    ${waitingWorker ? `<div class="tbanner"><span>${esc(t.update)}</span><button class="btn primary" data-tact="update">${esc(t.updateBtn)}</button></div>` : ''}
    ${risk ? `<div class="tbanner warn">${esc(t.risk(s.current))}</div>` : ''}
    <div class="qcard tcard">
      <h2 style="margin:0 0 8px;font-size:20px">${esc(t.title)}</h2>
      <p class="big">${s.today.count} / ${s.today.goal} <span class="muted">${esc(t.answered)}</span></p>
      <div class="prog wide" role="progressbar" aria-valuemin="0" aria-valuemax="${s.today.goal}" aria-valuenow="${s.today.count}"><i style="width:${pct}%"></i></div>
      <p class="hint">${esc(s.today.met ? t.goalMet : t.left(s.today.goal - s.today.count))}</p>
    </div>
    <div class="qcard tcard">
      <p class="big">🔥 ${s.current} <span class="muted">${esc(t.streak(s.current))}</span></p>
      <p class="hint">${esc(t.best)}: ${s.best}${s.today.met ? '' : ' · ' + esc(t.open)}</p>
      <h4 class="h4">${esc(t.history)}</h4>
      <div class="hist">${days.map((d) => `<span class="hd ${d.met ? 'met' : d.count ? 'part' : ''}" title="${d.day}: ${d.count}">${+d.day.slice(8)}</span>`).join('')}</div>
    </div>
    <div class="qcard tcard">
      <div class="qbtns" style="margin:0">
        <button class="btn primary" data-tact="go-quiz">${esc(t.start)}: ${esc(t.quiz)}</button>
        <button class="btn primary" data-tact="go-code">${esc(t.start)}: ${esc(t.code)}</button>
      </div>
    </div>
    <div class="qcard tcard">
      <div class="row"><span class="lbl">${esc(t.goal)}</span>${[5, 10, 20, 30].map((k) => `<button class="${ACT.goal === k ? 'on' : ''}" data-goal="${k}">${k}</button>`).join('')}</div>
      <p class="hint small">${esc(t.persist)}</p>
    </div>`;
}

document.getElementById('today').addEventListener('click', async (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  const d = b.dataset;
  if (d.goal) { ACT.goal = +d.goal; saveAct(); renderToday(); }
  else if (d.tact === 'go-quiz') show('quiz');
  else if (d.tact === 'go-code') show('code');
  else if (d.tact === 'update') waitingWorker?.postMessage('SKIP_WAITING');
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) renderToday(); });
