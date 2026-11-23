import type { MonthlyRow } from './strategies';
import type { LiveData } from './useLiveData';

/** Extend the immutable model history with separately identified IB months. */
export function performanceMonths(rows: MonthlyRow[], live?: LiveData['liveMonthly']) {
  const merged = new Map(rows.map(row => [row.year, { ...row, months: [...row.months] }]));
  const brokerMonths = new Set<string>();
  const finalModelMonth = rows.flatMap(row => row.months.map((v, i) =>
    v === null ? '' : `${row.year}-${String(i + 1).padStart(2, '0')}`)).sort().at(-1) || '';
  const duplicates = new Set<string>();
  for (const { month, returnPct } of [...(live?.rows ?? [])].sort((a, b) => a.month.localeCompare(b.month))) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || !Number.isFinite(returnPct) || returnPct <= -100
        || month <= finalModelMonth || duplicates.has(month)) continue;
    duplicates.add(month);
    // Missing months must remain unavailable rather than being drawn as zero.
    const previous = brokerMonths.size ? Array.from(brokerMonths).sort().at(-1)! : finalModelMonth;
    const next = new Date(`${previous}-01T00:00:00Z`);
    next.setUTCMonth(next.getUTCMonth() + 1);
    if (month !== next.toISOString().slice(0, 7)) continue;
    const year = Number(month.slice(0, 4));
    const index = Number(month.slice(5)) - 1;
    const existing = merged.get(year);
    const months = existing ? [...existing.months] : Array<number | null>(12).fill(null);
    months[index] = returnPct;
    const ytd = (months.reduce<number>((nav, value) => nav * (1 + (value ?? 0) / 100), 1) - 1) * 100;
    merged.set(year, { ...existing, year, months, ytd });
    brokerMonths.add(month);
  }
  return { rows: Array.from(merged.values()).sort((a, b) => a.year - b.year), brokerMonths };
}
