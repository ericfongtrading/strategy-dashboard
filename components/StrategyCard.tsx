import type { Strategy } from '@/lib/strategies';

const statusConfig: Record<Strategy['status'], { label: string; color: string; dot: boolean }> = {
  live: { label: 'Live', color: 'text-good bg-good/10 border-good/30', dot: true },
  active: { label: 'Active', color: 'text-good bg-good/10 border-good/30', dot: true },
  backtest: { label: 'Backtest', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', dot: false },
  development: { label: 'In Development', color: 'text-warn bg-warn/10 border-warn/30', dot: false },
};

function MetricBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div className="text-[11px] text-muted uppercase tracking-wider">{label}</div>
      <div className={`text-lg font-semibold metric-value ${color || 'text-white'}`}>{value}</div>
    </div>
  );
}

export function StrategyCard({ s, onClick }: { s: Strategy; onClick: () => void }) {
  const st = statusConfig[s.status];
  const displayLabel = s.statusLabel || st.label;

  if (s.status === 'development') {
    return (
      <button
        onClick={onClick}
        className="strategy-card text-left rounded-xl border border-dashed border-border bg-bg-card/50 p-5 flex flex-col gap-3 cursor-pointer min-h-[180px]"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-white/70">{s.name}</h3>
            <div className="text-xs text-muted mt-0.5">{s.asset} &middot; {s.edge}</div>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${st.color}`}>
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
      className="strategy-card text-left rounded-xl border border-border bg-bg-card p-5 flex flex-col gap-4 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white">{s.name}</h3>
          <div className="text-xs text-muted mt-0.5">{s.asset} &middot; {s.edge}</div>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${st.color}`}>
          {st.dot && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
            </span>
          )}
          {displayLabel}
        </span>
      </div>

      <div className="flex items-end gap-5 flex-wrap">
        {s.cagr && <MetricBox label="CAGR" value={s.cagr} color="text-good" />}
        {s.sharpe && <MetricBox label="Sharpe" value={s.sharpe} />}
        {s.maxDD && <MetricBox label="Max DD" value={s.maxDD} color="text-bad" />}
      </div>

      {s.dataSource && (
        <div className="text-[11px] text-muted">{s.dataSource}</div>
      )}
    </button>
  );
}
