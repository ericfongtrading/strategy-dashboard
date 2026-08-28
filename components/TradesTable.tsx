import type { Trade, Position } from '@/lib/strategies';

export function RecentTrades({ trades }: { trades: Trade[] }) {
  // Only show the instrument column when some trade actually carries one, so
  // single-market strategies keep their existing layout.
  const showSymbol = trades.some((t) => !!t.symbol);
  // Same opt-in pattern for entry dates: when present, the single Date column
  // becomes an Entered/Exited pair.
  const showEntryDate = trades.some((t) => !!t.entryDate);
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
              <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">R</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-bg-hover/30">
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
                <td className={`px-2 py-2 text-right font-mono metric-value ${
                  t.rMultiple?.startsWith('+') ? 'text-good' : 'text-bad'
                }`}>
                  {t.rMultiple || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CurrentPositions({ positions }: { positions: Position[] }) {
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
                <td className={`px-2 py-2 text-right font-semibold font-mono metric-value ${p.pnlNum >= 0 ? 'text-good' : 'text-bad'}`}>
                  {p.pnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
