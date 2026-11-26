// Daily goal and streak. Pure functions: no storage, no clock (`now` is an argument).
// Days are the device's LOCAL calendar dates, so a streak survives midnight and DST shifts.
// Data shape: `perDay` is an object { 'YYYY-MM-DD': answeredCount }.
(function (root) {
  const p2 = (n) => String(n).padStart(2, '0');

  function dayKey(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  }

  // UTC math so 23h/25h DST days cannot skew the calendar arithmetic.
  function shiftDay(key, days) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
  }

  function summarize(perDay, goal, now) {
    const today = dayKey(now);
    const met = (k) => (perDay[k] ?? 0) >= goal;
    // Today is pending until met: it does not break the streak, and counts only once met.
    let current = 0;
    let k = met(today) ? today : shiftDay(today, -1);
    while (met(k)) { current += 1; k = shiftDay(k, -1); }
    let best = 0, run = 0, prev = null;
    for (const day of Object.keys(perDay).filter(met).sort()) {
      run = prev && shiftDay(prev, 1) === day ? run + 1 : 1;
      best = Math.max(best, run);
      prev = day;
    }
    const count = perDay[today] ?? 0;
    return { today: { count, goal, met: count >= goal }, current, best: Math.max(best, current) };
  }

  function recentDays(perDay, goal, now, n = 14) {
    const today = dayKey(now);
    return Array.from({ length: n }, (_, i) => {
      const day = shiftDay(today, i - (n - 1));
      const count = perDay[day] ?? 0;
      return { day, count, met: count >= goal };
    });
  }

  /** True when a streak exists and today's goal is still open (so it would break at midnight). */
  function atRisk(perDay, goal, now) {
    const s = summarize(perDay, goal, now);
    return !s.today.met && s.current > 0;
  }

  const api = { dayKey, shiftDay, summarize, recentDays, atRisk };
  if (typeof module !== 'undefined') module.exports = api; else root.Streak = api;
})(typeof self !== 'undefined' ? self : globalThis);
