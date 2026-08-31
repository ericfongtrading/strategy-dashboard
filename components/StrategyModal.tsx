'use client';

import { useEffect, useCallback } from 'react';
import type { Strategy } from '@/lib/strategies';
import { useLiveData } from '@/lib/useLiveData';
import { EquityChart } from './EquityChart';
import { MonthlyReturns } from './MonthlyReturns';
import { RecentTrades, CurrentPositions, PendingPlans } from './TradesTable';

const statusConfig: Record<Strategy['status'], { label: string; color: string; dot: boolean }> = {
  live: { label: 'Live', color: 'text-good bg-good/10 border-good/30', dot: true },
  active: { label: 'Active', color: 'text-good bg-good/10 border-good/30', dot: true },
  backtest: { label: 'Backtest', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', dot: false },
  development: { label: 'In Development', color: 'text-warn bg-warn/10 border-warn/30', dot: false },
};

function Metric({ label, value, large, color }: { label: string; value: string; large?: boolean; color?: string }) {
  return (
    <div className="rounded-lg bg-bg/60 border border-border px-4 py-3">
      <div className="text-[11px] text-muted uppercase tracking-wider mb-1">{label}</div>
      <div className={`${large ? 'text-2xl' : 'text-lg'} font-bold metric-value ${color || 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

export function StrategyModal({ s, onClose }: { s: Strategy | null; onClose: () => void }) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!s) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [s, handleKey]);

  const { data: liveData } = useLiveData(s?.id || '');

  if (!s) return null;

  const st = statusConfig[s.status];
  const displayLabel = s.statusLabel || st.label;
  const hasChart = s.status !== 'development' && s.cagrNum;

  const trades = liveData?.recentTrades || s.recentTrades;
  const positions = liveData?.positions || s.positions;
  const plans = liveData?.plans;
  // Strategies with a track record too short to annualise supply their own
  // headline numbers instead of an invented CAGR.
  const headline = liveData?.headline;
  const monthlyRows = liveData?.monthlyReturns || s.monthlyReturns;
  // "theoretical" only when the live feed says so — a feed of real fills
  // (e.g. GC) must not be labelled theoretical.
  const _basis = (liveData?.basis || '').toUpperCase();
  // A feed is model/signal-level if it says so either way. A feed of REAL fills
  // (e.g. GC) says neither and keeps the plain backtested legend.
  const isTheoretical = _basis.includes('THEORETICAL') || _basis.includes('STRATEGY RETURNS');
  const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const liveSince = s.liveStart
    ? `${s.liveStartMonth ? MONTH_ABBR[s.liveStartMonth - 1] + ' ' : ''}${s.liveStart}`
    : undefined;

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="modal-panel relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-bg-modal shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-bg-modal/95 backdrop-blur border-b border-border px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1">{s.edge}</div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{s.asset}</h2>
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
            <div className="text-sm text-muted mt-0.5">{s.name}</div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg border border-border p-1.5 text-muted hover:text-white hover:border-border-hover transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Live headline (strategies with no meaningful CAGR yet) */}
          {headline && headline.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {headline.map((h, i) => (
                <div key={i} className="rounded-lg bg-bg/60 border border-border px-4 py-3">
                  <div className="text-[11px] text-muted uppercase tracking-wider mb-1">{h.label}</div>
                  <div className={`text-2xl font-bold metric-value ${
                    h.tone === 'good' ? 'text-good' : h.tone === 'bad' ? 'text-bad' : 'text-white'
                  }`}>
                    {h.value}
                  </div>
                  {h.sub && <div className="text-[11px] text-muted mt-0.5">{h.sub}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Metrics row */}
          {(s.cagr || s.sharpe || s.maxDD) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {s.cagr && <Metric label={s.cagrLabel || 'CAGR'} value={s.cagr} large color="text-good" />}
              {s.pf && <Metric label="Profit Factor" value={s.pf} />}
              {s.winRate && <Metric label="Win Rate" value={s.winRate} />}
              {s.sharpe && <Metric label="Sharpe Ratio" value={s.sharpe} large />}
              {s.maxDD && <Metric label="Max Drawdown" value={s.maxDD} large color="text-bad" />}
            </div>
          )}

          {/* Equity chart */}
          {hasChart && (
            <div className="rounded-xl border border-border bg-bg/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">Performance</h4>
                {s.dataSource && <span className="text-[11px] text-muted">{s.dataSource}</span>}
              </div>
              <EquityChart strategy={monthlyRows ? { ...s, monthlyReturns: monthlyRows } : s} />
            </div>
          )}

          {/* Signals-on-price chart image */}
          {s.chartImg && (
            <div className="rounded-xl border border-border bg-bg/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">Signals on Price</h4>
                {s.chartImgLabel && <span className="text-[11px] text-muted">{s.chartImgLabel}</span>}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.chartImg} alt="Strategy signals overlaid on price" className="w-full h-auto" />
            </div>
          )}

          {/* Monthly Returns */}
          {monthlyRows && monthlyRows.length > 0 && (
            <MonthlyReturns rows={monthlyRows} theoretical={isTheoretical} liveSince={liveSince} />
          )}

          {/* Current Positions */}
          {positions && <CurrentPositions positions={positions} note={liveData?.priceNote} />}

          {/* Pending Plans — setups published before they trigger */}
          {plans && <PendingPlans plans={plans} />}

          {/* Recent Trades */}
          {trades && trades.length > 0 && (
            <RecentTrades trades={trades} />
          )}

          {/* Last updated */}
          {liveData?.lastUpdated && (
            <div className="text-[10px] text-muted text-right">
              Last updated: {new Date(liveData.lastUpdated).toLocaleString()}
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Overview</h4>
            <p className="text-sm text-white/80 leading-relaxed">{s.description}</p>
          </div>

          {/* Highlights */}
          {s.highlights && s.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Key Points</h4>
              <ul className="space-y-1.5">
                {s.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-accent mt-1 shrink-0">&#x2022;</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reports / Proof */}
          {(s.pdfEn || s.pdfZh || s.proofUrl) && (
            <div>
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Reports</h4>
              <div className="flex flex-wrap gap-2">
                {s.pdfEn && (
                  <a
                    href={s.pdfEn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent-dim border border-accent/20 px-3.5 py-2 text-sm text-accent hover:bg-accent/20 transition-colors"
                  >
                    English Report
                  </a>
                )}
                {s.pdfZh && (
                  <a
                    href={s.pdfZh}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3.5 py-2 text-sm text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    中文报告
                  </a>
                )}
                {s.proofUrl && (
                  <a
                    href={s.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-warn/10 border border-warn/20 px-3.5 py-2 text-sm text-warn hover:bg-warn/20 transition-colors"
                  >
                    {s.proofLabel || 'View Proof'}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
