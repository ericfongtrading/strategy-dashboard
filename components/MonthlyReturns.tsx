import type { MonthlyRow } from '@/lib/strategies';
import type { LiveData } from '@/lib/useLiveData';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Cell({ value, isMtd, isBroker }: { value: number | null; isMtd?: boolean; isBroker?: boolean }) {
  if (value === null) return <td className="px-2 py-1.5 text-center text-muted/30">—</td>;
  const color = value > 0 ? 'text-good' : value < 0 ? 'text-bad' : 'text-white/60';
  const prefix = value > 0 ? '+' : '';
  return (
    <td className={`px-2 py-1.5 text-center text-xs font-medium metric-value ${color}`}>
      {prefix}{value.toFixed(1)}%
      {isBroker && <span className="text-[9px] text-muted ml-0.5 align-super">IB</span>}
      {isMtd && <span className="text-[9px] text-muted ml-0.5 align-super">MTD</span>}
    </td>
  );
}

export function MonthlyReturns({ rows, theoretical, liveSince, note, strategyOnly, dataThrough, modelOnly, costNote, liveMonthly }: { rows: MonthlyRow[]; theoretical?: boolean; liveSince?: string; note?: string; strategyOnly?: boolean; dataThrough?: string; modelOnly?: boolean; costNote?: string; liveMonthly?: LiveData['liveMonthly'] }) {
  const tableRows = new Map(rows.map((row) => [row.year, row]));
  const brokerMonths = new Set<string>();
  for (const { month, returnPct } of liveMonthly?.rows ?? []) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || !Number.isFinite(returnPct)) continue;
    const year = Number(month.slice(0, 4));
    const index = Number(month.slice(5)) - 1;
    const existing = tableRows.get(year);
    if (existing?.months[index] != null) continue;
    const months = existing ? [...existing.months] : Array<number | null>(12).fill(null);
    months[index] = returnPct;
    const ytd = (months.reduce<number>((nav, value) => nav * (1 + (value ?? 0) / 100), 1) - 1) * 100;
    tableRows.set(year, { ...existing, year, months, ytd });
    brokerMonths.add(month);
  }
  return (
    <div className="rounded-xl border border-border bg-bg/40 p-4">
      <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{brokerMonths.size ? 'Monthly Returns' : modelOnly ? 'Monthly Model Returns' : strategyOnly ? 'Monthly Strategy Returns' : 'Monthly Historical Returns'}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 700 }}>
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted uppercase tracking-wider w-14">Year</th>
              {MONTHS.map((m) => (
                <th key={m} className="px-2 py-2 text-center text-[10px] font-semibold text-muted uppercase tracking-wider">{m}</th>
              ))}
              <th className="px-2 py-2 text-center text-[10px] font-semibold text-muted uppercase tracking-wider bg-bg/60 rounded-t">YTD</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(tableRows.values()).sort((a, b) => a.year - b.year).map((row) => {
              const lastDataIdx = row.months.reduce<number>((acc, v, i) => (v !== null ? i : acc), -1);
              const isPartialLive = !modelOnly && (row.isLive || (dataThrough && row.year === new Date(dataThrough).getUTCFullYear())) && lastDataIdx < 11 && lastDataIdx >= 0;
              return (
                <tr key={row.year} className="border-b border-border/50 hover:bg-bg-hover/30">
                  <td className="px-2 py-1.5 text-sm font-semibold text-white">
                    {row.year}
                    {row.isLive && (
                      <span className="ml-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-good pulse-dot" />
                    )}
                  </td>
                  {row.months.map((v, i) => (
                    <Cell
                      key={i}
                      value={v}
                      isMtd={!!isPartialLive && i === lastDataIdx}
                      isBroker={brokerMonths.has(`${row.year}-${String(i + 1).padStart(2, '0')}`)}
                    />
                  ))}
                  <td className={`px-2 py-1.5 text-center text-xs font-bold metric-value bg-bg/60 ${
                    row.ytd === null ? 'text-muted/30' : row.ytd > 0 ? 'text-good' : 'text-bad'
                  }`}>
                    {row.ytd === null ? '—' : `${row.ytd > 0 ? '+' : ''}${row.ytd.toFixed(1)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted">
        {!strategyOnly && !modelOnly && <span className="flex items-center gap-1">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-good pulse-dot" />
          Live since {liveSince || 'Jul 2026'}
        </span>}
        {modelOnly ? <span>{costNote || 'Historical model returns · stated research costs'}</span> : strategyOnly ? <span>Strategy returns · 1 pip assumed round-trip cost</span> : theoretical ? (
          <span>Strategy returns, net of measured costs</span>
        ) : rows.some((r) => !r.isLive) ? (
          <span>All other rows are backtested</span>
        ) : null}
      </div>
      {note && <p className="mt-2 text-[10px] leading-relaxed text-muted/80">{note}</p>}
      {brokerMonths.size > 0 && liveMonthly && (
        <p className="mt-2 text-[10px] leading-relaxed text-muted/80">
          IB months use realized P&amp;L {liveMonthly.riskNormalized ? 'rescaled to the model’s risk per trade' : 'at actual sizes'} ({liveMonthly.basis}). Returns start from the model’s closing equity. Last recorded IB close {liveMonthly.lastClose} HKT. YTD compounds the months shown.
        </p>
      )}
    </div>
  );
}
