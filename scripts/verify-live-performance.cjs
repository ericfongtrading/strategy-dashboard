/** Runtime checks for the actual shared merge and rendered chart/table. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const cache = {};
function load(relative) {
  if (cache[relative]) return cache[relative];
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  const js = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022}}).outputText;
  const module = {exports:{}};
  new Function('require','module','exports',js)(name => name === '@/lib/performanceMonths' ? load('lib/performanceMonths.ts') : require(name),module,module.exports);
  cache[relative] = module.exports;
  return module.exports;
}
const {performanceMonths} = load('lib/performanceMonths.ts');
const {MonthlyReturns} = load('components/MonthlyReturns.tsx');
const {EquityChart} = load('components/EquityChart.tsx');
for (const id of ['gc','hsi','nq','fx']) {
  const model = JSON.parse(fs.readFileSync(path.join(root,'lib',id+'Model.json')));
  const data = JSON.parse(fs.readFileSync(path.join(root,'data',id+'.json')));
  const before = JSON.stringify(model.monthlyReturns);
  const merged = performanceMonths(model.monthlyReturns,data.liveMonthly);
  assert.equal(JSON.stringify(model.monthlyReturns),before,'Model input mutated');
  assert.equal(merged.brokerMonths.size,1);
  const nov = data.liveMonthly.rows.find(r=>r.month==='2026-11').returnPct;
  assert.equal(merged.rows.find(r=>r.year===2026).months[10],nov);
  let base = 100;
  for (const row of model.monthlyReturns) for (const pct of row.months) if (pct!==null) base*=1+pct/100;
  let combined = 100;
  for (const row of merged.rows) for (const pct of row.months) if (pct!==null) combined*=1+pct/100;
  assert(Math.abs(combined-base*(1+nov/100))<1e-10);
  const table=renderToStaticMarkup(React.createElement(MonthlyReturns,{rows:model.monthlyReturns,liveMonthly:data.liveMonthly,modelOnly:true}));
  const chart=renderToStaticMarkup(React.createElement(EquityChart,{strategy:{id,monthlyReturns:model.monthlyReturns,equityModelOnly:true,equityEndLabel:'30 Oct 2026'},liveMonthly:data.liveMonthly}));
  assert(table.includes(`${nov>0?'+':''}${nov.toFixed(1)}%`));
  assert(chart.includes('IB closed-trade extension'));
  assert(chart.includes(data.liveMonthly.lastClose+' HKT'));
  const green=chart.match(/<path d="([^"]+)" fill="none" stroke="#10b981"/)[1];
  assert(green.includes('L'),'No visible IB extension');
  console.log(id+': November '+nov+'%, reconciled equity index '+combined.toFixed(6)+', table/chart rendered');
}
const rows=[{year:2026,months:[1,2,3,4,5,6,7,8,9,10,null,null],ytd:0}];
const before=JSON.stringify(rows);
const live={basis:'test',lastClose:'2026-12-20',rows:[{month:'2026-12',returnPct:3},{month:'2026-10',returnPct:999},{month:'2026-11',returnPct:2}]};
const m=performanceMonths(rows,live);
assert.equal(JSON.stringify(rows),before);
assert.equal(m.rows[0].months[9],10);
assert.equal(m.rows[0].months[10],2);
assert.equal(m.rows[0].months[11],3);
assert.equal(performanceMonths(rows,{...live,rows:[{month:'2026-12',returnPct:3}]}).brokerMonths.size,0);
assert.equal(performanceMonths(rows,{...live,rows:[{month:'2026-11',returnPct:NaN}]}).brokerMonths.size,0);
console.log('Historical preservation, rollover, gaps, invalid values and out-of-order months passed');
