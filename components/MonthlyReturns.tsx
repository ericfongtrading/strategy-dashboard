import type { MonthlyRow } from '@/lib/strategies';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Cell({ value, isMtd }: { value: number | null; isMtd?: boolean }) {
  if (value === null) return <td className="px-2 py-1.5 text-center text-muted/30">—</td>;
  const color = value > 0 ? 'text-good' : value < 0 ? 'text-bad' : 'text-white/60';
  const prefix = value > 0 ? '+' : '';
  return (
    <td className={`px-2 py-1.5 text-center text-xs font-medium metric-value ${color}`}>
      {prefix}{value.toFixed(1)}%
      {isMtd && <span className="text-[9px] text-muted ml-0.5 align-super">MTD</span>}
    </td>
  );
}

export function MonthlyReturns({ rows, theoretical }: { rows: MonthlyRow[]; theoretical?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-bg/40 p-4">
      <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Monthly Historical Returns</h4>
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
            {rows.map((row) => {
              const lastDataIdx = row.months.reduce<number>((acc, v, i) => (v !== null ? i : acc), -1);
              const isPartialLive = row.isLive && lastDataIdx < 11 && lastDataIdx >= 0;
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
                      isMtd={isPartialLive && i === lastDataIdx}
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
        <span className="flex items-center gap-1">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-good pulse-dot" />
          Live since Jul 2026
        </span>
        {theoretical ? (
          <span>Figures are backtested / theoretical</span>
        ) : (
          <span>All other rows are backtested</span>
        )}
      </div>
    </div>
  );
}
