import { Fragment } from 'react';
import type { Trade, Position, Plan } from '@/lib/strategies';

export function RecentTrades({ trades }: { trades: Trade[] }) {
  // Only show the instrument column when some trade actually carries one, so
  // single-market strategies keep their existing layout.
  const showSymbol = trades.some((t) => !!t.symbol);
  // Same opt-in pattern for entry dates: when present, the single Date column
  // becomes an Entered/Exited pair.
  const showEntryDate = trades.some((t) => !!t.entryDate);
  // A P&L number says what happened; the exit reason says why. Only the Hyper
  // bot's feed carries one, so the column is opt-in like the others.
  const showNote = trades.some((t) => !!t.note);
  // Opt-in too: a feed with no R-multiples was showing a column of dashes.
  const showR = trades.some((t) => !!t.rMultiple);
  return (
    <div className="rounded-xl border border-border bg-bg/40 p-4">
      <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Recent Closed Trades</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 500 }}>
          <thead>
            <tr className="border-b border-border">
              {showEntryDate && (
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Entered</th>
              )}
              <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">{showEntryDate ? 'Exited' : 'Date'}</th>
              {showSymbol && (
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Symbol</th>
              )}
              <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Side</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Entry</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Exit</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">P&L</th>
              {showR && (
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">R</th>
              )}
              {showNote && (
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Why</th>
              )}
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => (
              <Fragment key={i}>
              <tr className={`hover:bg-bg-hover/30 ${t.lesson ? '' : 'border-b border-border/50'}`}>
                {showEntryDate && (
                  <td className="px-2 py-2 text-white/80 font-mono">{t.entryDate || '—'}</td>
                )}
                <td className="px-2 py-2 text-white/80 font-mono">{t.date}</td>
                {showSymbol && (
                  <td className="px-2 py-2 text-white font-medium">{t.symbol || '—'}</td>
                )}
                <td className="px-2 py-2">
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    t.direction === 'Long'
                      ? 'bg-good/10 text-good border border-good/20'
                      : 'bg-bad/10 text-bad border border-bad/20'
                  }`}>
                    {t.direction}
                  </span>
                </td>
                <td className="px-2 py-2 text-right text-white/80 font-mono metric-value">{t.entry}</td>
                <td className="px-2 py-2 text-right text-white/80 font-mono metric-value">{t.exit}</td>
                <td className={`px-2 py-2 text-right font-semibold font-mono metric-value ${t.pnlNum >= 0 ? 'text-good' : 'text-bad'}`}>
                  {t.pnl}
                </td>
                {showR && (
                  <td className={`px-2 py-2 text-right font-mono metric-value ${
                    t.rMultiple?.startsWith('+') ? 'text-good' : 'text-bad'
                  }`}>
                    {t.rMultiple || '—'}
                  </td>
                )}
                {showNote && (
                  <td className="px-2 py-2 text-muted whitespace-nowrap">{t.note || '—'}</td>
                )}
              </tr>
              {t.lesson && (
                <tr className="border-b border-border/50">
                  <td colSpan={12} className="px-2 pb-2 pt-0 text-[11px] text-warn/90">
                    {t.lesson}
                  </td>
                </tr>
              )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CurrentPositions({ positions, note }: { positions: Position[]; note?: string }) {
  // Risk detail is opt-in per column: a feed that only marks to market (GC, NQ)
  // keeps its original four columns, while a feed that knows where the stop and
  // the targets sit shows them, because "short at 79,000, up $1,404" without a
  // stop tells a reader nothing about what is actually at risk.
  const showStop = positions.some((p) => !!p.stop);
  const showTargets = positions.some((p) => !!p.targets);
  const showRealized = positions.some((p) => !!p.realized);
  const showOpen = positions.some((p) => !!p.open);
  if (!positions.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-bg/40 p-4">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Current Positions</h4>
        <p className="text-sm text-muted">No open positions</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg/40 p-4">
      <div className="flex items-center gap-2 mb-3">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">Current Positions</h4>
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-good pulse-dot" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 480 }}>
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Symbol</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Side</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Entry</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Current</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Size</th>
              {showOpen && (
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Open</th>
              )}
              {showStop && (
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Stop</th>
              )}
              {showTargets && (
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Targets</th>
              )}
              {showRealized && (
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Realized</th>
              )}
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Unrealized</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-bg-hover/30">
                <td className="px-2 py-2 text-white font-medium">{p.symbol}</td>
                <td className="px-2 py-2">
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    p.direction === 'Long'
                      ? 'bg-good/10 text-good border border-good/20'
                      : 'bg-bad/10 text-bad border border-bad/20'
                  }`}>
                    {p.direction}
                  </span>
                </td>
                <td className="px-2 py-2 text-right text-white/80 font-mono metric-value">{p.entry}</td>
                <td className="px-2 py-2 text-right text-white/80 font-mono metric-value">{p.current}</td>
                <td className="px-2 py-2 text-right text-white/80">{p.size}</td>
                {showOpen && (
                  <td className="px-2 py-2 text-right text-white/80 font-mono metric-value">{p.open || '—'}</td>
                )}
                {showStop && (
                  <td className="px-2 py-2 text-right text-bad/90 font-mono metric-value whitespace-nowrap">{p.stop || '—'}</td>
                )}
                {showTargets && (
                  <td className="px-2 py-2 text-right text-good/90 font-mono metric-value whitespace-nowrap">{p.targets || '—'}</td>
                )}
                {showRealized && (
                  <td className="px-2 py-2 text-right text-white/80 font-mono metric-value">{p.realized || '—'}</td>
                )}
                <td className={`px-2 py-2 text-right font-semibold font-mono metric-value ${p.pnlNum >= 0 ? 'text-good' : 'text-bad'}`}>
                  {p.pnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <div className="mt-2 text-[10px] text-muted">{note}</div>}
    </div>
  );
}


/** Setups the bot is waiting on. Published before they trigger, which is the one
 *  thing a conditional planner can show that a fill log cannot: the reader sees
 *  the call, then sees what it did. Nothing here is a position. */
export function PendingPlans({ plans }: { plans: Plan[] }) {
  if (!plans.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-bg/40 p-4">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Pending Plans</h4>
        <p className="text-sm text-muted">No setups queued</p>
      </div>
    );
  }
  const showConviction = plans.some((p) => !!p.conviction);
  return (
    <div className="rounded-xl border border-border bg-bg/40 p-4">
      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">Pending Plans</h4>
        <span className="text-[10px] text-muted">not entered &mdash; waiting on price and conditions</span>
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-xs" style={{ minWidth: 520 }}>
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Plan</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Side</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Entry Zone</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Stop</th>
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Targets</th>
              {showConviction && (
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Conviction</th>
              )}
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-bg-hover/30">
                <td className="px-2 py-2 text-white font-medium">{p.symbol}</td>
                <td className="px-2 py-2">
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    p.direction === 'Long'
                      ? 'bg-good/10 text-good border border-good/20'
                      : 'bg-bad/10 text-bad border border-bad/20'
                  }`}>
                    {p.direction}
                  </span>
                </td>
                <td className="px-2 py-2 text-right text-white/80 font-mono metric-value whitespace-nowrap">{p.zone}</td>
                <td className="px-2 py-2 text-right text-bad/90 font-mono metric-value">{p.stop}</td>
                <td className="px-2 py-2 text-right text-good/90 font-mono metric-value whitespace-nowrap">{p.targets}</td>
                {showConviction && (
                  <td className="px-2 py-2 text-right text-warn whitespace-nowrap">
                    {'★'.repeat(p.conviction || 0)}
                  </td>
                )}
                <td className="px-2 py-2 text-right text-muted whitespace-nowrap">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
