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
  return headline.map(h => /^(Lessons Learned|Max Closed-Trade Drawdown)$/i.test(h.label) ? {
    label: 'Max Closed-Trade Drawdown',
    value: dd === null ? '—' : `${dd > 0 ? '−' : ''}$${dd >= 1000 ? (dd/1000).toFixed(2)+'k' : Math.round(dd).toLocaleString('en-US')}`,
    sub: dd === null ? 'Complete closed-trade results unavailable' : `${trades.length} closed trades · 1 BTC each · excludes open P&L`,
    ...(dd !== null && dd > 0 ? { tone: 'bad' as const } : {}),
  } : h);
}
