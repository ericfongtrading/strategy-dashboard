import type { Strategy } from '@/lib/strategies';

const statusConfig: Record<Strategy['status'], { label: string; color: string; dot: boolean }> = {
  live: { label: 'Live', color: 'text-good bg-good/10 border-good/30', dot: true },
  active: { label: 'Active', color: 'text-good bg-good/10 border-good/30', dot: true },
  backtest: { label: 'Backtest', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', dot: false },
  development: { label: 'In Development', color: 'text-warn bg-warn/10 border-warn/30', dot: false },
};

export function StrategyCard({ s, onClick }: { s: Strategy; onClick: () => void }) {
  const st = statusConfig[s.status];
  const displayLabel = s.statusLabel || st.label;

  if (s.status === 'development') {
    return (
      <button
        onClick={onClick}
        className="strategy-card text-left rounded-xl border border-dashed border-border bg-bg-card/50 p-6 flex flex-col gap-4 cursor-pointer min-h-[240px]"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">{s.edge}</div>
            <h3 className="text-xl font-bold text-white/60">{s.asset}</h3>
            <div className="text-sm text-muted mt-0.5">{s.name}</div>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${st.color}`}>
            {displayLabel}
          </span>
        </div>
        <p className="text-sm text-muted leading-relaxed flex-1">{s.description}</p>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="strategy-card text-left rounded-xl border border-border bg-bg-card p-6 flex flex-col gap-5 cursor-pointer"
    >
      {/* Header: Product + Status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">{s.edge}</div>
          <h3 className="text-2xl font-bold text-white">{s.asset}</h3>
          <div className="text-sm text-muted mt-0.5">{s.name}</div>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${st.color}`}>
          {st.dot && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
            </span>
          )}
          {displayLabel}
        </span>
      </div>

      {/* Large CAGR */}
      {s.cagr && (
        <div>
          <div className="text-[11px] text-muted uppercase tracking-wider">{s.cagrLabel || 'CAGR'}</div>
          <div className="text-4xl font-bold metric-value text-good">{s.cagr}</div>
        </div>
      )}

      {/* Supporting metrics */}
      <div className="flex items-end gap-6">
        {s.sharpe && (
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">Sharpe</div>
            <div className="text-xl font-semibold metric-value text-white">{s.sharpe}</div>
          </div>
        )}
        {s.maxDD && (
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">Max DD</div>
            <div className="text-xl font-semibold metric-value text-bad">{s.maxDD}</div>
          </div>
        )}
      </div>

      {s.dataSource && (
        <div className="text-xs text-muted mt-auto pt-1">{s.dataSource}</div>
      )}
    </button>
  );
}
