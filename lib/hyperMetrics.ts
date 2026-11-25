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

/** Headline tiles for the Hyper bot. The feed reports P&L in USDC at the bot's
 * standard accounting unit of 1 BTC per trade and it is shown as recorded.
 * No assumed capital and no percentage model: the "aggressive model" basis
 * (P&L ÷ 21,775.50 USDC, a capital sized from a development-period drawdown)
 * was removed on 2026-11-25 at the manager's instruction. */
export function hyperDrawdownHeadline(headline: Headline[] | undefined, trades: Trade[]): Headline[] | undefined {
  if (!headline) return headline;
  const expected = headline.find(h => h.label === 'Cumulative P&L')?.sub?.match(/(\d+) trades/);
  const complete = !expected || Number(expected[1]) === trades.length;
  const dd = complete ? closedTradeDrawdown(trades) : null;
  const profit = trades.reduce((sum,t)=>sum+t.pnlNum,0);
  const factor = dd !== null && dd > 0 ? profit/dd : null;
  const formula = 'Cumulative recorded profit ÷ maximum closed-trade drawdown';
  // 'Cumulative P&L' is passed through exactly as the feed states it ("+$6,403", "45 trades, 1 BTC each").
  return headline.map(h => /^(Lessons Learned|Max Closed-Trade Drawdown|Recovery Factor)$/i.test(h.label) ? {
    label: 'Recovery Factor',
    value: factor === null ? '—' : `${factor.toFixed(2)}×`,
    sub: `${formula}. Drawdown = largest peak-to-trough fall in cumulative closed-trade P&L. 1 BTC per trade; excludes open P&L.`,
  } : h);
}

export const HYPER_RETURN_BASIS = 'P&L is recorded in USDC at the bot\'s standard accounting unit of 1 BTC per trade (live orders on Hyperliquid are currently 0.4 BTC). Cumulative over closed trades, not annualized; excludes open P&L and funding. No assumed capital and no percentage model.';
