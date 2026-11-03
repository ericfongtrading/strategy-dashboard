import type { Headline, Trade } from './strategies';



/** Closed-trade ledger drawdown, not marked-to-market account drawdown.

 * The Hyper feed contains the full history, newest first, at 1 BTC per trade.

 * Reverse first to preserve execution order for trades sharing an exit date.

 */

export function closedTradeDrawdown(trades: Trade[]): number | null {

  if (!trades.length || trades.some(t => !Number.isFinite(t.pnlNum) || !Number.isFinite(Date.parse(t.date)))) return null;

  const ordered = [...trades].reverse().sort((a,b) => Date.parse(a.date)-Date.parse(b.date));

  let equity = 0, peak = 0, worst = 0;

  for (const trade of ordered) {

    equity += trade.pnlNum;

    peak = Math.max(peak, equity);

    worst = Math.max(worst, peak-equity);

  }

  return worst;

}



export function hyperDrawdownHeadline(headline: Headline[] | undefined, trades: Trade[]): Headline[] | undefined {

  if (!headline) return headline;

  const expected = headline.find(h => h.label === 'Cumulative P&L')?.sub?.match(/(\d+) trades/);

  const complete = !expected || Number(expected[1]) === trades.length;

  const dd = complete ? closedTradeDrawdown(trades) : null;

  const profit = trades.reduce((sum,t)=>sum+t.pnlNum,0);
  const factor = dd !== null && dd > 0 ? profit/dd : null;
  const formula = 'Cumulative recorded profit ÷ maximum closed-trade drawdown';
  return headline.map(h => h.label === 'Cumulative P&L' ? {
    label: 'Cumulative model return',
    value: dd === null ? '—' : hyperMoneyReturn(h.value),
    tone: profit >= 0 ? 'good' : 'bad',
    sub: `${trades.length} trades · aggressive basis · not annualized`,
  } : /^(Lessons Learned|Max Closed-Trade Drawdown|Recovery Factor)$/i.test(h.label) ? {
    label: 'Recovery Factor',
    value: factor === null ? '—' : `${factor.toFixed(2)}×`,
    sub: `${formula}. Drawdown = largest peak-to-trough fall in cumulative closed-trade P&L. 1 BTC per trade; excludes open P&L.`,
  } : h);
}

// Fixed at user selection on 2026-11-03; do not resize after later drawdowns.
export const HYPER_MODEL_CAPITAL = 21775.50;
export const HYPER_RETURN_BASIS = 'Aggressive model: recorded P&L divided by fixed assumed capital of 21,775.50 USDC per 1 BTC trade. Capital was set from historical closed-trade drawdown of 4,355.10 USDC / 20%. Cumulative, not annualized; not actual account return. No additional fee/funding adjustment; intratrade drawdown and margin stress are not modelled.';
export function hyperReturn(pnl: number): string {
  if (!Number.isFinite(pnl)) return '—';
  const pct = pnl / HYPER_MODEL_CAPITAL * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
}
export function hyperMoneyReturn(value: string | undefined): string {
  if (!value || !/^[+-]?\$[\d,]+(?:\.\d+)?$/.test(value.trim())) return '—';
  return hyperReturn(Number(value.replace(/[$,]/g, '')));
}
