const test = require('node:test');
const assert = require('node:assert');
const S = require('../src/streak.js');

const at = (key) => new Date(`${key}T12:00:00`).getTime();

test('streak counts consecutive met days ending today', () => {
  const r = S.summarize({ '2026-03-01': 10, '2026-03-02': 12, '2026-03-03': 10 }, 10, at('2026-03-03'));
  assert.deepEqual([r.current, r.best, r.today.met], [3, 3, true]);
});
test('pending today does not break the streak', () => {
  const r = S.summarize({ '2026-03-01': 10, '2026-03-02': 10, '2026-03-03': 4 }, 10, at('2026-03-03'));
  assert.deepEqual([r.current, r.today.met], [2, false]);
  assert.equal(S.atRisk({ '2026-03-02': 10 }, 10, at('2026-03-03')), true);
});
test('missing yesterday resets current but keeps best', () => {
  const r = S.summarize({ '2026-03-01': 10, '2026-03-02': 10, '2026-03-04': 10 }, 10, at('2026-03-04'));
  assert.deepEqual([r.current, r.best], [1, 2]);
});
test('no activity: no streak, not at risk', () => {
  assert.equal(S.atRisk({}, 10, at('2026-03-03')), false);
  assert.equal(S.summarize({}, 10, at('2026-03-03')).current, 0);
});
test('shiftDay crosses month, year and DST boundaries', () => {
  assert.equal(S.shiftDay('2026-03-01', -1), '2026-02-28');
  assert.equal(S.shiftDay('2026-01-01', -1), '2025-12-31');
  assert.equal(S.shiftDay('2026-03-28', 1), '2026-03-29');
});
test('recentDays returns n days oldest first', () => {
  const d = S.recentDays({ '2026-03-03': 10 }, 10, at('2026-03-03'), 3);
  assert.deepEqual(d.map((x) => x.day), ['2026-03-01', '2026-03-02', '2026-03-03']);
  assert.equal(d[2].met, true);
});
