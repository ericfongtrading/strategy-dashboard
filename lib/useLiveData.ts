import { useState, useEffect } from 'react';
import { hyperDrawdownHeadline } from './hyperMetrics';
import type { Trade, Position, MonthlyRow, Plan, Headline } from './strategies';
import type { OptionsPayoff } from '@/components/OptionsPayoffChart';

export type LiveData = {
  lastUpdated: string;
  basis?: string;
  recentTrades: Trade[];
  positions: Position[];
  monthlyReturns?: MonthlyRow[];
  /** Setups not yet entered. Hyper bot only; other feeds omit it. */
  plans?: Plan[];
  /** Card/modal headline numbers for strategies with no meaningful CAGR yet. */
  headline?: Headline[];
  detailHeadline?: Headline[];
  /** e.g. the mark used for unrealised P&L. */
  priceNote?: string;
  /** Aggregate terminal P&L curve for the current options portfolio. */
  payoff?: OptionsPayoff;
  /** FX observer coverage and methodology, independent of broker fills. */
  dataThrough?: string;
  monthlyNote?: string;
};

const REPO_RAW = 'https://raw.githubusercontent.com/ericfongtrading/strategy-dashboard/main/data';
const cache: Record<string, { data: LiveData; ts: number }> = {};
const CACHE_TTL = 60_000;
/** How often an OPEN page re-checks. The feed publishes on any real change to
 *  the book, so a page left open should not sit on the snapshot it loaded with. */
const POLL_MS = 60_000;

function nqIbOnly(raw: any): LiveData {
  const lane = raw?.lanes?.ib || {};
  const records = Array.isArray(lane.records) ? lane.records : [];
  const money = (v: number) => `${v >= 0 ? '+' : '-'}$${Math.abs(v).toFixed(2)}`;
  const px = (v: unknown) => typeof v === 'number' ? v.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '-';
  const closed = records
    .filter((r: any) => r.status === 'CLOSED')
    .sort((a: any, b: any) => String(b.exit_utc || '').localeCompare(String(a.exit_utc || '')))
    .slice(0, 5)
    .map((r: any) => ({
      date: String(r.exit_utc || r.entry_utc || '').slice(0, 10),
      direction: r.side > 0 ? 'Long' : 'Short',
      entry: px(r.entry),
      exit: px(r.exit),
      pnl: money(Number(r.net_usd || 0)),
      pnlNum: Number(r.net_usd || 0),
      rMultiple: `${Number(r.net_r || 0) >= 0 ? '+' : ''}${Number(r.net_r || 0).toFixed(2)}R`,
      sleeve: r.sleeve,
      source: 'IB',
    }));
  const positions = records
    .filter((r: any) => r.status !== 'CLOSED' && Number(r.remaining || 0) > 0)
    .map((r: any) => ({
      symbol: r.instrument || 'MNQ',
      direction: r.side > 0 ? 'Long' : 'Short',
      entry: px(r.entry),
      current: px(r.entry),
      size: String(r.remaining),
      pnl: '-',
      pnlNum: 0,
      stop: px(r.stop),
      targets: px(r.target),
    }));
  return {
    lastUpdated: raw?.updated_utc || new Date().toISOString(),
    basis: 'Live section contains actual IB fills only. Historical headline and monthly figures come from the latest 1/1/1/2 production backtest.',
    recentTrades: closed,
    positions,
  };
}

export function useLiveData(strategyId: string) {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // An empty id means "this caller does not want a live feed" (a card that has
    // not opted in, or a closed modal). Fetching it would request data/.json.
    if (!strategyId) {
      setData(null);
      return;
    }

    let alive = true;

    const load = (force: boolean) => {
      const cached = cache[strategyId];
      if (!force && cached && Date.now() - cached.ts < CACHE_TTL) {
        setData(cached.data);
        return;
      }
      if (!cached) setLoading(true);
      const liveFile = strategyId === 'nq' ? 'nq_compare' : strategyId;
      fetch(`${REPO_RAW}/${liveFile}.json?t=${Date.now()}`)
        .then((r) => {
          if (!r.ok) throw new Error('not found');
          return r.json();
        })
        .then((raw: any) => {
          if (!alive) return;
          const d: LiveData = strategyId === 'nq' ? nqIbOnly(raw) : raw;
          if (strategyId === 'fx' && Date.now() - Date.parse(d.lastUpdated) > 15 * 60_000) {
            d.headline = d.headline?.map(h => h.label === 'TWS feed' ? { ...h, value: 'STALE', tone: 'bad' } : h);
          }
          if (strategyId === 'hyper-bot') {
            d.headline = hyperDrawdownHeadline(d.headline, d.recentTrades);
            d.detailHeadline = hyperDrawdownHeadline(d.detailHeadline, d.recentTrades);
          }
          cache[strategyId] = { data: d, ts: Date.now() };
          setData(d);
        })
        .catch(() => {
          // Keep whatever is already on screen. Wiping a working card because one
          // poll failed shows nothing in place of numbers that were merely stale.
          if (alive && !cache[strategyId]) setData(null);
        })
        .finally(() => {
          if (alive) setLoading(false);
        });
    };

    load(false);
    const timer = setInterval(() => load(true), POLL_MS);
    // Coming back to a tab that has been in the background for hours is exactly
    // when the numbers are most likely to be wrong.
    const onFocus = () => {
      if (document.visibilityState === 'visible') load(true);
    };
    document.addEventListener('visibilitychange', onFocus);
    window.addEventListener('focus', onFocus);

    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
    };
  }, [strategyId]);

  return { data, loading };
}
