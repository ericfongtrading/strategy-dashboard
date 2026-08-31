'use client';

import type { Strategy } from '@/lib/strategies';
import { useLiveData } from '@/lib/useLiveData';

const statusConfig: Record<Strategy['status'], { label: string; color: string; dot: boolean }> = {
  live: { label: 'Live', color: 'text-good bg-good/10 border-good/30', dot: true },
  active: { label: 'Active', color: 'text-good bg-good/10 border-good/30', dot: true },
  backtest: { label: 'Backtest', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', dot: false },
  development: { label: 'In Development', color: 'text-warn bg-warn/10 border-warn/30', dot: false },
};

export function StrategyCard({ s, onClick }: { s: Strategy; onClick: () => void }) {
  const st = statusConfig[s.status];
  const displayLabel = s.statusLabel || st.label;
  // Only cards that opt in fetch on the front page, so adding one live card does
  // not turn the grid into ten requests, nine of which 404.
  const { data: live } = useLiveData(s.liveHeadline ? s.id : '');
  const headline = s.liveHeadline ? live?.headline : undefined;
  const openCount = s.liveHeadline ? live?.positions?.length : undefined;
  const planCount = s.liveHeadline ? live?.plans?.length : undefined;

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

      {/* Live headline: the real numbers for a strategy too young to annualise */}
      {headline && headline.length > 0 && (
        <>
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">{headline[0].label}</div>
            <div className={`text-4xl font-bold metric-value ${
              headline[0].tone === 'bad' ? 'text-bad' : 'text-good'
            }`}>
              {headline[0].value}
            </div>
            {headline[0].sub && <div className="text-[11px] text-muted mt-0.5">{headline[0].sub}</div>}
          </div>
          <div className="flex items-end gap-6">
            {headline.slice(1).map((h, i) => (
              <div key={i}>
                <div className="text-[11px] text-muted uppercase tracking-wider">{h.label}</div>
                <div className="text-xl font-semibold metric-value text-white">{h.value}</div>
              </div>
            ))}
          </div>
          {(openCount !== undefined || planCount !== undefined) && (
            <div className="flex items-center gap-2 text-[11px] text-muted flex-wrap">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-good pulse-dot" />
              <span>{openCount || 0} open {openCount === 1 ? 'position' : 'positions'}</span>
              <span className="text-border">&middot;</span>
              <span>{planCount || 0} pending {planCount === 1 ? 'plan' : 'plans'}</span>
            </div>
          )}
        </>
      )}

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
        {s.pf && (
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">PF</div>
            <div className="text-xl font-semibold metric-value text-white">{s.pf}</div>
          </div>
        )}
        {s.winRate && (
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">Win Rate</div>
            <div className="text-xl font-semibold metric-value text-white">{s.winRate}</div>
          </div>
        )}
      </div>

      {s.dataSource && (
        <div className="text-xs text-muted mt-auto pt-1">{s.dataSource}</div>
      )}
    </button>
  );
}
