'use client';

export type PayoffPoint = { spot: number; pnlBtc: number };
export type OptionsPayoff = {
  asOf: string;
  spot: number;
  points: PayoffPoint[];
  method: string;
};

export function OptionsPayoffChart({ payoff }: { payoff: OptionsPayoff }) {
  const points = payoff.points;
  if (points.length < 2) return null;
  const W = 580, H = 230, pad = { top: 14, right: 14, bottom: 32, left: 58 };
  const xs = points.map(p => p.spot), ys = points.map(p => p.pnlBtc);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys, 0), maxY = Math.max(...ys, 0);
  const yPad = Math.max((maxY - minY) * 0.12, 0.002);
  const loY = minY - yPad, hiY = maxY + yPad;
  const plotW = W - pad.left - pad.right, plotH = H - pad.top - pad.bottom;
  const x = (v: number) => pad.left + ((v - minX) / (maxX - minX)) * plotW;
  const y = (v: number) => pad.top + plotH - ((v - loY) / (hiY - loY)) * plotH;
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.spot).toFixed(1)},${y(p.pnlBtc).toFixed(1)}`).join(' ');
  const fill = `${path} L${x(maxX)},${y(0)} L${x(minX)},${y(0)} Z`;
  const money = (v: number) => `${v < 0 ? '-' : '+'}${Math.abs(v).toFixed(3)} BTC`;
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3 text-xs text-muted">
        <span>All open BTC options at their respective expiries</span>
        <span>Spot now ${payoff.spot.toLocaleString()}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H }}>
        <defs><linearGradient id="options-payoff-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.22"/><stop offset="100%" stopColor="#ef4444" stopOpacity="0.15"/></linearGradient></defs>
        <line x1={pad.left} y1={y(0)} x2={W-pad.right} y2={y(0)} stroke="#6b7280" strokeWidth="0.8" strokeDasharray="4,3" />
        <line x1={x(payoff.spot)} y1={pad.top} x2={x(payoff.spot)} y2={H-pad.bottom} stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4,3" />
        <path d={fill} fill="url(#options-payoff-fill)" />
        <path d={path} fill="none" stroke="#38bdf8" strokeWidth="2.2" />
        <text x={pad.left-6} y={y(hiY)+4} textAnchor="end" fill="#9ca3af" fontSize="9">{money(hiY)}</text>
        <text x={pad.left-6} y={y(0)+4} textAnchor="end" fill="#9ca3af" fontSize="9">0</text>
        <text x={pad.left-6} y={y(loY)+4} textAnchor="end" fill="#9ca3af" fontSize="9">{money(loY)}</text>
        <text x={x(minX)} y={H-9} textAnchor="start" fill="#9ca3af" fontSize="10">${Math.round(minX/1000)}k</text>
        <text x={x(payoff.spot)} y={H-9} textAnchor="middle" fill="#38bdf8" fontSize="10">now</text>
        <text x={x(maxX)} y={H-9} textAnchor="end" fill="#9ca3af" fontSize="10">${Math.round(maxX/1000)}k</text>
      </svg>
      <p className="mt-2 text-[10px] leading-relaxed text-muted">{payoff.method}</p>
    </div>
  );
}
