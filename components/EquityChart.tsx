'use client';

import { useMemo } from 'react';
import type { Strategy } from '@/lib/strategies';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function buildFromMonthly(s: Strategy): { backtest: number[]; live: number[]; months: number } | null {
  if (!s.monthlyReturns || s.monthlyReturns.length === 0) return null;

  const liveYear = s.liveStart || 9999;
  const liveMonth = (s.liveStartMonth || 1) - 1;

  const backtestPoints: number[] = [100];
  const livePoints: number[] = [];
  let equity = 100;
  let liveStarted = false;

  for (const row of s.monthlyReturns) {
    for (let mi = 0; mi < row.months.length; mi++) {
      const m = row.months[mi];
      if (m === null) {
        if (!liveStarted) continue;
        break;
      }
      // A fixed-contract book on a fixed capital base does not compound: each
      // month adds its percentage points to the same denominator.
      equity = s.additiveEquity ? equity + m : equity * (1 + m / 100);

      const isLiveMonth = row.year > liveYear || (row.year === liveYear && mi >= liveMonth);
      if (isLiveMonth && !liveStarted) {
        liveStarted = true;
        livePoints.push(backtestPoints[backtestPoints.length - 1]);
      }
      if (liveStarted) {
        livePoints.push(equity);
      } else {
        backtestPoints.push(equity);
      }
    }
  }

  if (livePoints.length === 0) {
    livePoints.push(backtestPoints[backtestPoints.length - 1]);
    livePoints.push(equity);
  }

  return {
    backtest: backtestPoints,
    live: livePoints,
    months: backtestPoints.length - 1 + livePoints.length - 1,
  };
}

function generateEquityCurve(s: Strategy): { backtest: number[]; live: number[]; months: number } {
  const fromData = buildFromMonthly(s);
  if (fromData) return fromData;

  const cagr = s.cagrNum || 0.15;
  const maxDD = s.maxDDNum || 0.1;
  const startYr = s.backtestStart || 2020;
  const endYr = s.backtestEnd || 2025;
  const liveYr = s.liveStart || endYr;

  const backtestMonths = (endYr - startYr) * 12;
  const liveMonths = Math.max(3, Math.round((2026.7 - liveYr) * 12));
  const totalMonths = backtestMonths + liveMonths;

  const monthlyReturn = Math.pow(1 + cagr, 1 / 12) - 1;
  const monthlyVol = monthlyReturn * 1.8 + 0.015;

  const rng = seededRandom(hashStr(s.id));
  const curve: number[] = [100];

  const ddMonth = Math.floor(backtestMonths * (0.3 + rng() * 0.4));

  for (let i = 1; i < totalMonths; i++) {
    const noise = (rng() - 0.5) * 2 * monthlyVol;
    let ret = monthlyReturn + noise;

    if (i >= ddMonth && i < ddMonth + 3) {
      ret = -maxDD / 3 + (rng() - 0.5) * 0.005;
    }
    if (i === ddMonth + 3) {
      ret = maxDD * 0.4 + rng() * 0.02;
    }

    curve.push(curve[i - 1] * (1 + ret));
  }

  const backtest = curve.slice(0, backtestMonths + 1);
  const live = curve.slice(backtestMonths);

  return { backtest, live, months: totalMonths };
}

export function EquityChart({ strategy }: { strategy: Strategy }) {
  const { backtest, live, months } = useMemo(() => generateEquityCurve(strategy), [strategy]);

  const all = [...backtest, ...live.slice(1)];
  const minVal = Math.min(...all) * 0.95;
  const maxVal = Math.max(...all) * 1.02;

  const W = 580;
  const H = 220;
  const PAD = { top: 10, right: 10, bottom: 30, left: 50 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const x = (i: number) => PAD.left + (i / (months)) * plotW;
  const y = (v: number) => PAD.top + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;

  const backtestPath = backtest.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  const liveOffset = backtest.length - 1;
  const livePath = live.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(liveOffset + i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  const liveAreaPath = livePath +
    ` L${x(liveOffset + live.length - 1).toFixed(1)},${y(minVal).toFixed(1)}` +
    ` L${x(liveOffset).toFixed(1)},${y(minVal).toFixed(1)} Z`;

  const transitionX = x(liveOffset);

  // Take the axis label from the rows actually plotted, not from backtestStart:
  // the live feed can supply a shorter history than the static entry declares,
  // and a label that disagrees with the curve is worse than no label.
  const startYr = strategy.monthlyReturns?.[0]?.year ?? strategy.backtestStart ?? 2020;
  const liveYr = strategy.liveStart || strategy.backtestEnd || 2025;
  // When the live segment is a thin sliver (e.g. live started 2 months ago), the
  // transition-year label collides with the right-anchored 'Now' label. Shift it left;
  // if the divider sits so close to the edge that even the shifted label would touch
  // 'Now' (~22px wide), drop the year label entirely — 'Now' carries the meaning.
  const yrCrowded = transitionX > x(months) - 34;
  const yrHidden = transitionX > x(months) - 20;

  // Underwater series: distance below the running equity high, in percentage
  // points of capital. A month-end table cannot show a drawdown whose peak and
  // trough land mid-month, so plot it.
  const underwater = (() => {
    if (!strategy.showUnderwater) return null;
    // Prefer a daily-derived series: a drawdown whose peak and trough fall
    // mid-month is invisible in month-end data, which is exactly the number
    // this panel exists to show.
    let uw: number[];
    if (strategy.underwaterSeries && strategy.underwaterSeries.length > 1) {
      uw = strategy.underwaterSeries;
    } else {
      let peak = -Infinity;
      uw = all.map((v) => {
        if (v > peak) peak = v;
        return strategy.additiveEquity ? v - peak : (v / peak - 1) * 100;
      });
    }
    const worst = Math.min(...uw);
    if (worst >= -0.05) return null;
    const UH = 74;
    const n = uw.length - 1;
    const ux = (i: number) => PAD.left + (i / n) * plotW;
    const uy = (d: number) => 4 + (d / worst) * (UH - 22);
    const path = uw.map((d, i) => `${i === 0 ? 'M' : 'L'}${ux(i).toFixed(1)},${uy(d).toFixed(1)}`).join(' ');
    const area = `M${ux(0).toFixed(1)},${uy(0).toFixed(1)} ` +
      uw.map((d, i) => `L${ux(i).toFixed(1)},${uy(d).toFixed(1)}`).join(' ') +
      ` L${ux(n).toFixed(1)},${uy(0).toFixed(1)} Z`;
    return { path, area, worst, ux, uy, UH, troughIdx: uw.indexOf(worst) };
  })();

  const gridValues = [];
  const range = maxVal - minVal;
  const step = range > 300 ? 100 : range > 100 ? 50 : range > 30 ? 10 : 5;
  for (let v = Math.ceil(minVal / step) * step; v <= maxVal; v += step) {
    gridValues.push(v);
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-6 mb-3 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="3,2" /></svg>
          Backtest
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="#10b981" strokeWidth="2" /></svg>
          Live
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
        <defs>
          <linearGradient id={`live-fill-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridValues.map((v) => (
          <g key={v}>
            <line x1={PAD.left} y1={y(v)} x2={W - PAD.right} y2={y(v)} stroke="#1e2029" strokeWidth="0.5" />
            <text x={PAD.left - 6} y={y(v) + 3} textAnchor="end" fill="#4b5563" fontSize="9" fontFamily="Inter, sans-serif">
              {v.toFixed(0)}
            </text>
          </g>
        ))}

        {/* Transition line */}
        <line x1={transitionX} y1={PAD.top} x2={transitionX} y2={H - PAD.bottom} stroke="#1e2029" strokeWidth="1" strokeDasharray="4,3" />

        {/* Live area fill */}
        <path d={liveAreaPath} fill={`url(#live-fill-${strategy.id})`} />

        {/* Backtest line (dashed) */}
        <path d={backtestPath} fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Live line (solid) */}
        <path d={livePath} fill="none" stroke="#10b981" strokeWidth="2" />

        {/* Endpoint dot */}
        <circle cx={x(liveOffset + live.length - 1)} cy={y(live[live.length - 1])} r="3" fill="#10b981" />

        {/* X-axis labels */}
        <text x={x(0)} y={H - 8} fill="#4b5563" fontSize="10" textAnchor="start" fontFamily="Inter, sans-serif">{startYr}</text>
        {!yrHidden && (
          <text x={yrCrowded ? transitionX - 6 : transitionX} y={H - 8} fill="#9ca3af" fontSize="10" textAnchor={yrCrowded ? 'end' : 'middle'} fontFamily="Inter, sans-serif">{liveYr}</text>
        )}
        <text x={x(months)} y={H - 8} fill="#10b981" fontSize="10" textAnchor="end" fontFamily="Inter, sans-serif">Now</text>
      </svg>

      {underwater && (
        <div className="mt-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-muted">
              Drawdown from peak{strategy.underwaterLabel ? ` · ${strategy.underwaterLabel}` : ''}
            </span>
            <span className="text-[10px] metric-value text-bad">{underwater.worst.toFixed(1)}% worst</span>
          </div>
          <svg viewBox={`0 0 ${W} ${underwater.UH}`} className="w-full" style={{ maxHeight: underwater.UH }}>
            <defs>
              <linearGradient id={`uw-fill-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <line x1={PAD.left} y1={underwater.uy(0)} x2={W - PAD.right} y2={underwater.uy(0)} stroke="#1e2029" strokeWidth="0.5" />
            <line
              x1={PAD.left}
              y1={underwater.uy(underwater.worst)}
              x2={W - PAD.right}
              y2={underwater.uy(underwater.worst)}
              stroke="#1e2029"
              strokeWidth="0.5"
              strokeDasharray="3,3"
            />
            <text x={PAD.left - 6} y={underwater.uy(0) + 3} textAnchor="end" fill="#4b5563" fontSize="9" fontFamily="Inter, sans-serif">0%</text>
            <text
              x={PAD.left - 6}
              y={underwater.uy(underwater.worst) + 3}
              textAnchor="end"
              fill="#4b5563"
              fontSize="9"
              fontFamily="Inter, sans-serif"
            >
              {underwater.worst.toFixed(0)}%
            </text>
            <path d={underwater.area} fill={`url(#uw-fill-${strategy.id})`} />
            <path d={underwater.path} fill="none" stroke="#ef4444" strokeWidth="1.2" />
            <circle cx={underwater.ux(underwater.troughIdx)} cy={underwater.uy(underwater.worst)} r="2.5" fill="#ef4444" />
          </svg>
        </div>
      )}
    </div>
  );
}
