import { useState, useEffect } from 'react';
import type { Trade, Position, MonthlyRow, Plan, Headline } from './strategies';

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
  /** e.g. the mark used for unrealised P&L. */
  priceNote?: string;
};

const REPO_RAW = 'https://raw.githubusercontent.com/ericfongtrading/strategy-dashboard/main/data';
const cache: Record<string, { data: LiveData; ts: number }> = {};
const CACHE_TTL = 60_000;
/** How often an OPEN page re-checks. The feed publishes on any real change to
 *  the book, so a page left open should not sit on the snapshot it loaded with. */
const POLL_MS = 60_000;

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
      fetch(`${REPO_RAW}/${strategyId}.json?t=${Date.now()}`)
        .then((r) => {
          if (!r.ok) throw new Error('not found');
          return r.json();
        })
        .then((d: LiveData) => {
          if (!alive) return;
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
