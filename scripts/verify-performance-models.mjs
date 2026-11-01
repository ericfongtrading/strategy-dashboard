import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const approved = {
  gc: {cagr: '21.58', sharpe: '1.48', dd: '11.70', months: 83, start: '2019-12-26T18:15:00Z'},
  hsi: {cagr: '26.33', sharpe: '1.96', dd: '9.90', months: 70},
  nq: {cagr: '22.77', sharpe: '2.41', dd: '6.55', months: 71},
  fx: {cagr: '10.81', sharpe: '1.27', dd: '9.65', months: 94},
};
const allowed = new Set(['version','cagr','maxDD','dailySharpe','monthlyReturns','underwaterSeries',
  'dataFrom','dataThrough','monthlyNote','modelCostNote','underwaterLabel','basis','equityConvention']);
for (const [id, want] of Object.entries(approved)) {
  const model = JSON.parse(fs.readFileSync(path.join(root, 'lib', `${id}Model.json`), 'utf8'));
  assert(Object.keys(model).every(k => allowed.has(k)), `${id}: unexpected public field`);
  assert.equal((100 * model.cagr).toFixed(2), want.cagr);
  assert.equal(model.dailySharpe.toFixed(2), want.sharpe);
  assert.equal((100 * model.maxDD).toFixed(2), want.dd);
  let product = 1, count = 0, previousYear = 0;
  for (const row of model.monthlyReturns) {
    assert(row.year > previousYear); previousYear = row.year;
    assert.equal(row.months.length, 12);
    let annual = 1;
    for (const value of row.months) {
      if (value === null) continue;
      assert(Number.isFinite(value) && value > -100);
      annual *= 1 + value / 100; product *= 1 + value / 100; count++;
    }
    assert(Math.abs((annual - 1) * 100 - row.ytd) < 1e-8, `${id}: YTD does not compound`);
    if (row.year === 2026) assert.deepEqual(row.months.slice(10), [null, null]);
    assert(!row.isLive, `${id}: simulated year marked live`);
  }
  assert.equal(count, want.months);
  const years = (Date.parse(model.dataThrough) - Date.parse(model.dataFrom || want.start)) / (365.25 * 86400000);
  assert(Math.abs(product ** (1 / years) - 1 - model.cagr) < 1e-9, `${id}: chart CAGR differs from headline`);
  assert(Math.abs(-Math.min(...model.underwaterSeries) / 100 - model.maxDD) < 1e-9, `${id}: drawdown mismatch`);
  if (id === 'hsi') assert.equal(model.monthlyReturns[0].year, 2021);
  if (id === 'fx') assert.match(model.monthlyNote, /IB minimum commissions are excluded/);
  console.log(`${id}: ${count} months, ending equity index ${(100 * product).toFixed(6)}, metrics reconciled`);
}
const modal = fs.readFileSync(path.join(root, 'components/StrategyModal.tsx'), 'utf8');
assert.match(modal, /s\.id === 'options' \|\| s\.equityModelOnly/);
const strategies = fs.readFileSync(path.join(root, 'lib/strategies.ts'), 'utf8');
assert.match(strategies, /Five-Sleeve Intraday Portfolio/);
assert.match(strategies, /"performanceNote": "Reduced-risk research model; IB minimum commissions excluded/);
